import Sidebar from '@/components/Sidebar'

export default function BillingPage() {
  return (
    <div className="flex h-screen bg-[#F8F9FA] text-[#111827]">
      <Sidebar role="parent" />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-serif text-[#0C4A3A]">Complete enrolment</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-500">Asia/Karachi</span>
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0C4A3A] flex items-center justify-center font-bold text-sm">
                P
              </div>
            </div>
          </header>
          
          <p className="text-gray-500 mb-8">Choose a payment method and review the package.</p>
          
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Payment Methods */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment methods</h2>
              
              <div className="space-y-4">
                {/* Method 1: Card */}
                <label className="block cursor-pointer">
                  <input type="radio" name="payment" className="peer sr-only" defaultChecked />
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 peer-checked:bg-[#D1EBE1] peer-checked:border-[#0C4A3A] transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-[#0C4A3A] text-lg">Debit / credit card</h3>
                        <p className="text-sm text-[#0C4A3A]/70">Local and international cards</p>
                      </div>
                      {/* Fake card icons */}
                      <div className="flex gap-2">
                        <div className="w-8 h-5 bg-gray-300 rounded"></div>
                        <div className="w-8 h-5 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Method 2: Mobile Money */}
                <label className="block cursor-pointer">
                  <input type="radio" name="payment" className="peer sr-only" />
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 peer-checked:bg-[#D1EBE1] peer-checked:border-[#0C4A3A] transition hover:bg-gray-50">
                    <h3 className="font-bold text-gray-900 text-lg">JazzCash / Easypaisa</h3>
                    <p className="text-sm text-gray-500">Through the selected Pakistani gateway</p>
                  </div>
                </label>

                {/* Method 3: Bank Transfer */}
                <label className="block cursor-pointer">
                  <input type="radio" name="payment" className="peer sr-only" />
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 peer-checked:bg-[#D1EBE1] peer-checked:border-[#0C4A3A] transition hover:bg-gray-50">
                    <h3 className="font-bold text-gray-900 text-lg">Bank transfer</h3>
                    <p className="text-sm text-gray-500">Upload proof for admin verification</p>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="w-full lg:w-96">
              <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order summary</h2>
                
                <div className="space-y-4 text-sm text-gray-700 font-medium mb-8">
                  <div className="flex justify-between">
                    <span>Steady progress • Tajweed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>3 classes per week • 30 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly billing • PKR</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon / sibling discount</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-6 flex justify-between items-center mb-8">
                  <span className="text-sm text-gray-500">Example total</span>
                  <span className="text-2xl font-bold text-[#0C4A3A]">PKR 9,000</span>
                </div>
                
                <button className="w-full bg-[#0C4A3A] text-white py-4 rounded-xl font-bold hover:bg-[#0D5C46] transition shadow-sm text-lg">
                  Pay & enrol
                </button>
              </div>
            </div>
            
          </div>
          
          <div className="mt-8 text-xs text-gray-400 flex gap-4 font-medium flex-wrap">
            <span>Invoices and receipts: PDF + email</span>
            <span>•</span>
            <span>History retained</span>
            <span>•</span>
            <span>Mobile checkout included</span>
            <span>•</span>
            <span>Merchant entity and gateway to confirm</span>
          </div>
          
        </div>
      </main>
    </div>
  )
}
