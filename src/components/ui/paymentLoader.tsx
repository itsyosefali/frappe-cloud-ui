import { CreditCard, Loader2 } from 'lucide-react'

function PaymentLoader() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">Opening Payment Screen</h3>
          <p className="mt-2 text-gray-500 text-center">Please wait while we prepare your payment screen...</p>
        </div>
      </div>
    </div>
  )
}
