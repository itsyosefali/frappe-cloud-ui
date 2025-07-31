# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

import frappe
from frappe import _
from frappe.query_builder.functions import Sum
from frappe.utils import add_days, cstr, flt, formatdate, getdate, month_diff
import calendar

import erpnext
from erpnext.accounts.doctype.accounting_dimension.accounting_dimension import (
	get_accounting_dimensions,
	get_dimension_with_children,
)
from erpnext.accounts.report.financial_statements import (
	filter_accounts,
	filter_out_zero_value_rows,
	set_gl_entries_by_account,
)
from erpnext.accounts.report.utils import convert_to_presentation_currency, get_currency

value_fields = (
	"opening_debit",
	"opening_credit",
	"debit",
	"credit",
	"closing_debit",
	"closing_credit",
)

dynamic_periods = []

# Utility to rebuild parent-children map after dimension expansion
def build_parent_children_map(data):
	pcm = {}
	for row in data:
		if not row or 'account' not in row or not row.get('parent_account'):
			continue
		pcm.setdefault(row['parent_account'], []).append(row['account'])
	return pcm

def execute(filters=None):
	if not filters:
		filters = {}

	validate_filters(filters)
	set_dynamic_periods(filters)
	fill_value_fields(filters)
	
	company_currency = get_currency(filters) if filters.get("presentation_currency") else erpnext.get_company_currency(filters.get("company"))
	accounts, accounts_by_name, parent_children_map = get_accounts_data(filters)
	data = get_data(filters, company_currency, accounts, accounts_by_name)

	if filters.get("show_dimensions"):
		data, parent_children_map = add_dimension_rows_with_balances(data, filters)
	
	data = filter_out_zero_value_rows_custom(
		data, parent_children_map, show_zero_values=filters.get("show_zero_values")
	)

	columns = get_columns(filters)

	return columns, data

def validate_filters(filters):
	if not filters.get("fiscal_year"):
		frappe.throw(_("Fiscal Year {0} is required").format(filters.get("fiscal_year")))

	fiscal_year_start = frappe.get_cached_value("Fiscal Year", filters.get("fiscal_year"), "year_start_date")
	fiscal_year_end = frappe.get_cached_value("Fiscal Year", filters.get("fiscal_year"), "year_end_date")
	if not fiscal_year_start or not fiscal_year_end:
		frappe.throw(_("Fiscal Year {0} does not exist").format(filters.get("fiscal_year")))
	else:
		filters.year_start_date = getdate(fiscal_year_start)
		filters.year_end_date = getdate(fiscal_year_end)

	if not filters.get("from_date"):
		filters.from_date = filters.year_start_date

	if not filters.get("to_date"):
		filters.to_date = filters.year_end_date

	filters.from_date = getdate(filters.from_date)
	filters.to_date = getdate(filters.to_date)

	if filters.from_date and filters.to_date and filters.from_date > filters.to_date:
		frappe.throw(_("From Date cannot be greater than To Date"))

	if (
		filters.from_date and filters.year_start_date and filters.year_end_date and
		(filters.from_date < filters.year_start_date or filters.from_date > filters.year_end_date)
	):
		frappe.msgprint(
			_("From Date should be within the Fiscal Year. Assuming From Date = {0}").format(
				formatdate(filters.year_start_date)
			)
		)
		filters.from_date = filters.year_start_date

	if (
		filters.to_date and filters.year_start_date and filters.year_end_date and
		(filters.to_date < filters.year_start_date or filters.to_date > filters.year_end_date)
	):
		frappe.msgprint(
			_("To Date should be within the Fiscal Year. Assuming To Date = {0}").format(
				formatdate(filters.year_end_date)
			)
		)
		filters.to_date = filters.year_end_date


def get_accounts_data(filters):
	accounts = frappe.db.sql(
		"""select name, account_number, parent_account, account_name, root_type, report_type, lft, rgt
				from `tabAccount` where company=%s order by lft""",
		filters.get("company"),
		as_dict=True,
	)

	if not accounts:
		return [], {}, {}

	accounts, accounts_by_name, parent_children_map = filter_accounts(accounts)
	return accounts, accounts_by_name, parent_children_map


def fill_value_fields(filters):
	global value_fields
	new_fields = [
		"opening_debit",
		"opening_credit",
		"debit",
		"credit",
		"closing_debit",
		"closing_credit",
	]

	if filters.get("show_dimensions"):
		for dimension in get_accounting_dimensions():
			new_fields.append(dimension.lower())
		
	for period in dynamic_periods:
		new_fields.append(f"{period['year']}_{period['month']}_debit")
		new_fields.append(f"{period['year']}_{period['month']}_credit")

	value_fields = tuple(new_fields)

def filter_out_zero_value_rows_custom(data, parent_children_map, show_zero_values=False):
	filtered = []
	for row in data:
		if not row or 'account' not in row:
			filtered.append(row)
			continue
		is_parent = bool(parent_children_map.get(row['account']))
		if is_parent:
			filtered.append(row)
		elif show_zero_values or row.get('has_value'):
			filtered.append(row)
	return filtered

def get_data(filters, company_currency, accounts, accounts_by_name):
	if not accounts:
		return []

	min_lft, max_rgt = None, None
	minmax_result = list(frappe.db.sql(
		"""select min(lft), max(rgt) from `tabAccount`
		where company=%s""",
		(filters.get("company"),),
		as_dict=False,
	))
	if minmax_result and minmax_result[0] and len(minmax_result[0]) == 2:
		min_lft, max_rgt = minmax_result[0][0], minmax_result[0][1]

	gl_entries_by_account = {}

	opening_balances = get_opening_balances(filters)

	if filters.get("project"):
		filters.project = [filters.project]

	set_gl_entries_by_account(
		filters.get("company"),
		filters.get("from_date"),
		filters.get("to_date"),
		min_lft,
		max_rgt,
		filters,
		gl_entries_by_account,
		ignore_closing_entries=not flt(filters.get("with_period_closing_entry")),
		ignore_opening_entries=True,
	)

	calculate_values(accounts, gl_entries_by_account, opening_balances, filters.get("show_net_values"))
	accumulate_values_into_parents(accounts, accounts_by_name, filters)

	data = prepare_data(accounts, filters, {}, company_currency)
	
	return data

def add_dimension_columns(data, filters):
	dimensions = get_accounting_dimensions()
	
	for row in data:
		if not row or 'account' not in row:
			continue
			
		gl_entries = frappe.get_all("GL Entry",
			filters={
				"account": row["account"],
				"company": filters.get("company"),
				"posting_date": ("between", [filters.get("from_date"), filters.get("to_date")]),
				"is_cancelled": 0
			},
			fields=dimensions,
			limit=1
		)
		
		if gl_entries:
			for dimension in dimensions:
				row[dimension.lower()] = gl_entries[0].get(dimension)
		else:
			for dimension in dimensions:
				row[dimension.lower()] = None
	
	return data

def add_dimension_rows(data, filters):
	"""
	Modify the data to repeat accounts for each unique combination of dimensions.
	"""
	dimensions = get_accounting_dimensions()
	dimension_fields = [d.lower() for d in dimensions]

	new_data = []

	for row in data:
		if not row or 'account' not in row:
			new_data.append(row)
			continue

		gl_entries = frappe.get_all(
			"GL Entry",
			filters={
				"account": row["account"],
				"company": filters.get("company"),
				"posting_date": ("between", [filters.get("from_date"), filters.get("to_date")]),
				"is_cancelled": 0
			},
			fields=dimension_fields,
			distinct=True
		)

		for entry in gl_entries:
			new_row = row.copy()
			for dimension in dimension_fields:
				new_row[dimension] = entry.get(dimension)
			new_data.append(new_row)

	return new_data

def add_dimension_rows_with_balances(data, filters):
	"""
	For each account, for each unique combination of dimensions, create a row with the same account, parent_account, and indent as the original.
	Only dimension fields and values are added. The parent-children map and hierarchy logic remain unchanged.
	"""
	dimensions = get_accounting_dimensions(as_list=False)
	dimension_fields = [d.fieldname for d in dimensions]
	value_fields_local = [
		"opening_debit", "opening_credit", "debit", "credit", "closing_debit", "closing_credit"
	]
	new_data = []
	for row in data:
		if not row or 'account' not in row:
			new_data.append(row)
			continue
		filters_dict = {
			"account": row["account"],
			"company": filters.get("company"),
			"posting_date": ("between", [filters.get("from_date"), filters.get("to_date")]),
			"is_cancelled": 0
		}
		gl_entries = frappe.get_all(
			"GL Entry",
			filters=filters_dict,
			fields=dimension_fields,
			distinct=True
		)
		if not gl_entries:
			# No dimension breakdown, just add the row as is
			new_data.append(row)
			continue
		for entry in gl_entries:
			# For each unique dimension combination, aggregate values
			entry_filters = filters_dict.copy()
			for dimension in dimension_fields:
				entry_filters[dimension] = entry.get(dimension)
			# Aggregate values for this account+dimension combination
			agg = frappe.db.get_list(
				"GL Entry",
				filters=entry_filters,
				fields=[
					"SUM(debit) as debit",
					"SUM(credit) as credit"
				]
			)
			debit = agg[0]["debit"] or 0
			credit = agg[0]["credit"] or 0
			# For dimension rows, opening_debit/opening_credit are not available from GL Entry, set to 0
			opening_debit = 0
			opening_credit = 0
			closing_debit = opening_debit + debit
			closing_credit = opening_credit + credit
			new_row = row.copy()
			for dimension in dimension_fields:
				new_row[dimension] = entry.get(dimension)
			new_row["opening_debit"] = opening_debit
			new_row["opening_credit"] = opening_credit
			new_row["debit"] = debit
			new_row["credit"] = credit
			new_row["closing_debit"] = closing_debit
			new_row["closing_credit"] = closing_credit
			new_row["has_value"] = any(abs(new_row.get(f, 0)) >= 0.005 for f in value_fields_local)
			new_data.append(new_row)
	return new_data, build_parent_children_map(new_data)

def get_opening_balances(filters):
	balance_sheet_opening = get_rootwise_opening_balances(filters, "Balance Sheet")
	pl_opening = get_rootwise_opening_balances(filters, "Profit and Loss")

	balance_sheet_opening.update(pl_opening)
	return balance_sheet_opening


def get_rootwise_opening_balances(filters, report_type):
	gle = []

	last_period_closing_voucher = ""
	ignore_closing_balances = frappe.db.get_single_value(
		"Accounts Settings", "ignore_account_closing_balance"
	)

	if not ignore_closing_balances:
		last_period_closing_voucher = frappe.db.get_all(
			"Period Closing Voucher",
			filters={"docstatus": 1, "company": filters.get("company"), "posting_date": ("<", filters.get("from_date"))},
			fields=["posting_date", "name"],
			order_by="posting_date desc",
			limit=1,
		)

	accounting_dimensions = get_accounting_dimensions(as_list=False)

	if last_period_closing_voucher:
		gle = get_opening_balance(
			"Account Closing Balance",
			filters,
			report_type,
			accounting_dimensions,
			period_closing_voucher=last_period_closing_voucher[0].name,
		)

		last_posting_date = getdate(last_period_closing_voucher[0].posting_date)
		from_date = getdate(add_days(filters.get("from_date"), -1))
		if last_posting_date and from_date and last_posting_date < from_date:
			start_date = add_days(last_period_closing_voucher[0].posting_date, 1)
			gle += get_opening_balance(
				"GL Entry", filters, report_type, accounting_dimensions, start_date=start_date
			)
	else:
		gle = get_opening_balance("GL Entry", filters, report_type, accounting_dimensions)

	if filters.get("show_dimensions"):
		dimensions = get_accounting_dimensions(as_list=False)
		dimension_fields = [d.fieldname for d in dimensions]
		opening = frappe._dict()
		for d in gle:
			key = [d.account]
			for dim in dimension_fields:
				key.append(getattr(d, dim, None))
			key = tuple(key)
			if key not in opening:
				opening[key] = {
					"account": d.account,
					"opening_debit": 0.0,
					"opening_credit": 0.0,
				}
				for dim in dimension_fields:
					opening[key][dim] = getattr(d, dim, None)
			opening[key]["opening_debit"] += flt(d.debit)
			opening[key]["opening_credit"] += flt(d.credit)
		return opening
	else:
		opening = frappe._dict()
		for d in gle:
			opening.setdefault(
				d.account,
				{
					"account": d.account,
					"opening_debit": 0.0,
					"opening_credit": 0.0,
				},
			)
			opening[d.account]["opening_debit"] += flt(d.debit)
			opening[d.account]["opening_credit"] += flt(d.credit)
		return opening


def get_opening_balance(
	doctype, filters, report_type, accounting_dimensions, period_closing_voucher=None, start_date=None
):
	closing_balance = frappe.qb.DocType(doctype)
	account = frappe.qb.DocType("Account")
	
	opening_balance = (
		frappe.qb.from_(closing_balance)
		.join(account)
		.on(closing_balance.account == account.name)
		.select(
			closing_balance.account,
			closing_balance.account_currency,
			Sum(closing_balance.debit).as_("debit"),
			Sum(closing_balance.credit).as_("credit"),
			Sum(closing_balance.debit_in_account_currency).as_("debit_in_account_currency"),
			Sum(closing_balance.credit_in_account_currency).as_("credit_in_account_currency"),
		)
		.where(
			(closing_balance.company == filters.get("company"))
			& (account.report_type == report_type)
		)
		.groupby(closing_balance.account)
	)

	for dimension in accounting_dimensions:
		opening_balance = opening_balance.select(
			getattr(closing_balance, dimension.fieldname).as_(dimension.fieldname))
		opening_balance = opening_balance.groupby(
			getattr(closing_balance, dimension.fieldname))

	if period_closing_voucher:
		opening_balance = opening_balance.where(
			closing_balance.period_closing_voucher == period_closing_voucher
		)
	else:
		if start_date:
			opening_balance = opening_balance.where(
				(closing_balance.posting_date >= start_date)
				& (closing_balance.posting_date < filters.get("from_date"))
			)
			opening_balance = opening_balance.where(closing_balance.is_opening == "No")
		else:
			opening_balance = opening_balance.where(
				(closing_balance.posting_date < filters.get("from_date")) | (closing_balance.is_opening == "Yes")
			)

	if doctype == "GL Entry":
		opening_balance = opening_balance.where(closing_balance.is_cancelled == 0)

	if (
		not filters.get("show_unclosed_fy_pl_balances")
		and report_type == "Profit and Loss"
		and doctype == "GL Entry"
	):
		opening_balance = opening_balance.where(closing_balance.posting_date >= filters.get("year_start_date"))

	if not flt(filters.get("with_period_closing_entry")):
		if doctype == "Account Closing Balance":
			opening_balance = opening_balance.where(closing_balance.is_period_closing_voucher_entry == 0)
		else:
			opening_balance = opening_balance.where(closing_balance.voucher_type != "Period Closing Voucher")

	if filters.get("cost_center"):
		cost_center_vals = frappe.db.get_value("Cost Center", filters.get("cost_center"), "lft, rgt")
		if cost_center_vals:
			if isinstance(cost_center_vals, tuple) and len(cost_center_vals) == 2:
				lft, rgt = cost_center_vals
			elif isinstance(cost_center_vals, dict):
				lft, rgt = cost_center_vals.get("lft"), cost_center_vals.get("rgt")
			else:
				lft = rgt = None
			if lft is not None and rgt is not None:
				cost_center = frappe.qb.DocType("Cost Center")
				opening_balance = opening_balance.where(
					closing_balance.cost_center.isin(
						frappe.qb.from_(cost_center)
						.select("name")
						.where((cost_center.lft >= lft) & (cost_center.rgt <= rgt))
					)
				)

	if filters.get("project"):
		opening_balance = opening_balance.where(closing_balance.project == filters.get("project"))
	if filters.get("include_default_book_entries"):
		company_fb = frappe.get_cached_value("Company", filters.get("company"), "default_finance_book")

		if filters.get("finance_book") and company_fb and cstr(filters.get("finance_book")) != cstr(company_fb):
			frappe.throw(_("To use a different finance book, please uncheck 'Include Default FB Entries'"))

		opening_balance = opening_balance.where(
			(closing_balance.finance_book.isin([cstr(filters.get("finance_book")), cstr(company_fb), ""]))
			| (closing_balance.finance_book.isnull())
		)
	else:
		opening_balance = opening_balance.where(
			(closing_balance.finance_book.isin([cstr(filters.get("finance_book")), ""]))
			| (closing_balance.finance_book.isnull())
		)

	if accounting_dimensions:
		for dimension in accounting_dimensions:
			if filters.get(dimension.fieldname):
				if frappe.get_cached_value("DocType", dimension.document_type, "is_tree"):
					filters[dimension.fieldname] = get_dimension_with_children(
						dimension.document_type, filters.get(dimension.fieldname)
					)
					opening_balance = opening_balance.where(
						closing_balance[dimension.fieldname].isin(filters[dimension.fieldname])
					)
				else:
					opening_balance = opening_balance.where(
						closing_balance[dimension.fieldname].isin(filters[dimension.fieldname])
					)

	gle = opening_balance.run(as_dict=1)

	if filters and filters.get("presentation_currency"):
		convert_to_presentation_currency(gle, get_currency(filters))

	return gle


def calculate_values(accounts, gl_entries_by_account, opening_balances, show_net_values):
	init = {
		"opening_debit": 0.0,
		"opening_credit": 0.0,
		"debit": 0.0,
		"credit": 0.0,
		"closing_debit": 0.0,
		"closing_credit": 0.0,
	}

	dimensions = get_accounting_dimensions() or []
	for dimension in dimensions:
		init[dimension.lower()] = 0.0

	for period in dynamic_periods:
		init[f"{period['year']}_{period['month']}_debit"] = 0.0
		init[f"{period['year']}_{period['month']}_credit"] = 0.0

	for d in accounts:
		d.update(init.copy())

		if frappe.local.form_dict.get("show_dimensions") if hasattr(frappe, 'local') and hasattr(frappe.local, 'form_dict') else False or d.get('show_dimensions') or ("show_dimensions" in d):
			key = [d.name]
			for dimension in dimensions:
				key.append(d.get(dimension.lower(), None))
			key = tuple(key)
			d["opening_debit"] = flt(opening_balances.get(key, {}).get("opening_debit", 0))
			d["opening_credit"] = flt(opening_balances.get(key, {}).get("opening_credit", 0))
		else:
			d["opening_debit"] = flt(opening_balances.get(d.name, {}).get("opening_debit", 0))
			d["opening_credit"] = flt(opening_balances.get(d.name, {}).get("opening_credit", 0))

		for entry in gl_entries_by_account.get(d.name, []):
			if cstr(entry.is_opening) != "Yes":
				d["debit"] = flt(d.get("debit", 0)) + flt(entry.debit)
				d["credit"] = flt(d.get("credit", 0)) + flt(entry.credit)
				for dimension in dimensions:
					if hasattr(entry, dimension):
						d[dimension.lower()] = getattr(entry, dimension) or 0.0
				temp_date = getdate(entry.posting_date)
				if temp_date and hasattr(temp_date, 'year') and hasattr(temp_date, 'month'):
					period_key = f"{temp_date.year}_{temp_date.month}_debit"
					d[period_key] = flt(d.get(period_key, 0)) + flt(entry.debit)
					period_key = f"{temp_date.year}_{temp_date.month}_credit"
					d[period_key] = flt(d.get(period_key, 0)) + flt(entry.credit)

		d["closing_debit"] = flt(d["opening_debit"]) + flt(d["debit"])
		d["closing_credit"] = flt(d["opening_credit"]) + flt(d["credit"])

		if show_net_values:
			prepare_opening_closing(d)


def calculate_total_row(accounts, company_currency):
	total_row = {
		"account": "'" + _("Total") + "'",
		"account_name": "'" + _("Total") + "'",
		"warn_if_negative": True,
		"opening_debit": 0.0,
		"opening_credit": 0.0,
		"debit": 0.0,
		"credit": 0.0,
		"closing_debit": 0.0,
		"closing_credit": 0.0,
		"parent_account": None,
		"indent": 0,
		"has_value": True,
		"currency": company_currency,
	}
	
	for field in value_fields:
		if field not in total_row:
			total_row[field] = 0.0
	
	for d in accounts:
		if not d.parent_account:
			for field in value_fields:
				total_row[field] += d[field]

	return total_row


def accumulate_values_into_parents(accounts, accounts_by_name, filters=None):
	"""
	Accumulate values from child accounts into parent accounts.
	When dimensions are enabled, multiple child rows per account need to be aggregated correctly.
	"""
	if not filters:
		filters = {}
		
	show_dimensions = filters.get("show_dimensions", False)
	
	if show_dimensions:
		# When dimensions are enabled, we need special handling to avoid double counting
		accumulate_with_dimensions(accounts, accounts_by_name)
	else:
		# Original logic for non-dimensional accounts
		for account in reversed(accounts):
			if account.get('parent_account') and account['parent_account'] in accounts_by_name:
				parent = accounts_by_name[account['parent_account']]
				for field in value_fields:
					parent[field] = flt(parent.get(field, 0)) + flt(account.get(field, 0))


def accumulate_with_dimensions(accounts, accounts_by_name):
	"""
	Special accumulation logic for when dimensions are enabled.
	Groups accounts by their name and aggregates dimensional data properly.
	"""
	# Track which parent accounts have been updated to prevent double counting
	processed_parent_accounts = set()
	
	# Group accounts by account name to handle multiple dimension rows per account
	accounts_by_account_name = {}
	for account in accounts:
		account_name = account.get('name') or account.get('account')
		if account_name:
			if account_name not in accounts_by_account_name:
				accounts_by_account_name[account_name] = []
			accounts_by_account_name[account_name].append(account)
	
	# Process in reverse order to ensure bottom-up aggregation
	for account in reversed(accounts):
		account_name = account.get('name') or account.get('account')
		parent_account_name = account.get('parent_account')
		
		if not account_name or not parent_account_name or parent_account_name not in accounts_by_name:
			continue
			
		parent = accounts_by_name[parent_account_name]
		
		# Create a unique key for this parent-child relationship
		relationship_key = (account_name, parent_account_name)
		
		if relationship_key not in processed_parent_accounts:
			# Aggregate all dimension rows for this account into the parent
			all_account_rows = accounts_by_account_name.get(account_name, [])
			
			# Sum all values across all dimension rows for this account
			account_totals = {}
			for field in value_fields:
				account_totals[field] = sum(flt(row.get(field, 0)) for row in all_account_rows)
			
			# Add the aggregated totals to the parent
			for field in value_fields:
				parent[field] = flt(parent.get(field, 0)) + account_totals[field]
			
			# Mark this relationship as processed
			processed_parent_accounts.add(relationship_key)


def prepare_data(accounts, filters, parent_children_map, company_currency):
	data = []

	for d in accounts:

		if parent_children_map.get(d.account) and filters.get("show_net_values"):
			prepare_opening_closing(d)

		has_value = False
		row = {
			"account": d.name,
			"parent_account": d.parent_account,
			"indent": d.indent,
			"from_date": filters.get("from_date"),
			"to_date": filters.get("to_date"),
			"currency": company_currency,
			"account_name": (
				f"{d.account_number} - {d.account_name}" if d.account_number else d.account_name
			),
		}

		if filters.get("show_dimensions"):
			for dimension in get_accounting_dimensions():
				row[dimension.lower()] = d.get(dimension.lower(), None)

		for key in value_fields:
			row[key] = flt(d.get(key, 0.0), 3)

			if abs(row[key]) >= 0.005:
				has_value = True

		row["has_value"] = has_value
		data.append(row)

	total_row = calculate_total_row(accounts, company_currency)
	data.extend([{}, total_row])

	return data



def get_columns(filters=None):
	
	columns = [
		{
			"fieldname": "account",
			"label": _("Account"),
			"fieldtype": "Link",
			"options": "Account",
			"width": 300,
		},
		{
			"fieldname": "currency",
			"label": _("Currency"),
			"fieldtype": "Link",
			"options": "Currency",
			"hidden": 1,
		},
		{
			"fieldname": "opening_debit",
			"label": _("Opening (Dr)"),
			"fieldtype": "Currency",
			"options": "currency",
			"width": 120,
		},
		{
			"fieldname": "opening_credit",
			"label": _("Opening (Cr)"),
			"fieldtype": "Currency",
			"options": "currency",
			"width": 120,
		},
		{
			"fieldname": "debit",
			"label": _("Debit"),
			"fieldtype": "Currency",
			"options": "currency",
			"width": 120,
		},
		{
			"fieldname": "credit",
			"label": _("Credit"),
			"fieldtype": "Currency",
			"options": "currency",
			"width": 120,
		},
		{
			"fieldname": "closing_debit",
			"label": _("Closing (Dr)"),
			"fieldtype": "Currency",
			"options": "currency",
			"width": 120,
		},
		{
			"fieldname": "closing_credit",
			"label": _("Closing (Cr)"),
			"fieldtype": "Currency",
			"options": "currency",
			"width": 120,
		}
	]

	if filters and filters.get("show_dimensions"):
		for dimension in get_accounting_dimensions(as_list=False):
			columns.append({
				"label": _(dimension.label),
				"fieldname": dimension.fieldname,
				"fieldtype": "Link",
				"options": dimension.document_type,
				"width": 150
			})
		

	for period in dynamic_periods:
		columns += [
			{"label": f"{period['year']}-{period['month']}-{period['month_name']} " + _("Debit"), 
			"fieldname": f"{period['year']}_{period['month']}_debit", 
			"fieldtype": "Currency", 
			"options": "currency", 
			"width": 180},
			{"label": f"{period['year']}-{period['month']}-{period['month_name']} " + _("Credit"), 
			"fieldname": f"{period['year']}_{period['month']}_credit", 
			"fieldtype": "Currency", 
			"options": "currency", 
			"width": 180},
		]

	return columns

def set_dynamic_periods(filters):
	global dynamic_periods
	dynamic_periods = []
	for period in get_period_months(filters):
		dynamic_periods.append(period)


def get_period_months(filters):

	result = []
	if filters.get("from_date") and filters.get("to_date"):
		year = filters.get("from_date").year
		difference = month_diff(filters.get("to_date"), filters.get("from_date"))
		month = filters.get("from_date").month
		for i in range(difference):
			month_name = calendar.month_name[month]
			
			result.append({
				"year": year,
				"month": month,
				"month_name": month_name
			})
			
			if month == 12:
				year = year + 1
				month = 1
			else:
				month = month + 1
	
	return result


def prepare_opening_closing(row):
	dr_or_cr = "debit" if row["root_type"] in ["Asset", "Equity", "Expense"] else "credit"
	reverse_dr_or_cr = "credit" if dr_or_cr == "debit" else "debit"

	for col_type in ["opening", "closing"]:
		valid_col = col_type + "_" + dr_or_cr
		reverse_col = col_type + "_" + reverse_dr_or_cr
		row[valid_col] -= row[reverse_col]
		if row[valid_col] < 0:
			row[reverse_col] = abs(row[valid_col])
			row[valid_col] = 0.0
		else:
			row[reverse_col] = 0.0