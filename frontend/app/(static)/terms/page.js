'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 pt-32 pb-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">Terms and Conditions (Warranty Policy)</h1>

                        <div className="prose max-w-none text-gray-600 space-y-6">
                            <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl mb-8">
                                <p className="font-semibold text-orange-800 text-sm">
                                    NOTE: WE ARE NOT APPLE OFFICIAL RESELLER BUT WE DO GIVE THE APPLE STANDARD LIMITED WARRANTY SERVICE SUPPORT FOR APPLE PRODUCTS PURCHASED FROM US. YOUR WARRANTY SHOULD BE MENTIONED IN YOUR PURCHASE INVOICE.
                                </p>
                            </div>

                            <ul className="space-y-4 list-disc pl-5">
                                <li>
                                    <p>For a situation like Global Pandemic or Any Political unrest etc where all the flights are not allowed or stopped and the Warranty is over during that period of time as we can't send abroad, <strong>Appleians</strong> will arrange to Fix/Repair the device all the issues as much as possible in Country or from Outside the country. The Customer takes Full Cost responsibility. Also might even need 2-3 months even if necessary as have to arrange parts as they needs to be imported or repaired outside country. The device might be partially unfixed too, The customer is most welcome to get it repaired from other service centre as he wishes.</p>
                                </li>
                                <li>
                                    <p>In the case of Apple Mac Book, the installation of other operating systems (dual boot) deleting MacOS will void the warranty of the product.</p>
                                </li>
                                <li>
                                    <p>All products do not come with a warranty. Warranty is only valid for products that purchased with a warranty for a given period time, mentioned in the bill or invoice issued by <strong>Appleians</strong>.</p>
                                </li>
                                <li>
                                    <p>If the product of a particular model is not repairable and the same or equivalent product is not available in our stock, then a good product from that model can be replaced by depreciation and price adjustment.</p>
                                </li>
                                <li>
                                    <p>If any software or data is damaged or lost during the use of the product or the service in <strong>Appleians</strong>, <strong>Appleians</strong> is no responsible will carry. Note that in this case, <strong>Appleians</strong> is also not responsible for data recovery or software restoration.</p>
                                </li>
                                <li>
                                    <p>There is no fixed time to return the product after completing the service work after taking the product of the specific model under warranty, this time can be from 5-6 days to a maximum of 35-40 days or more; This is because in most cases, the parts required for repair do not have sufficient buffer stock in the country, so they have to be imported, which is very time-consuming.</p>
                                </li>
                                <li>
                                    <p>Consumers are informed that most of the warranty products are not repaired, the parts that are damaged are replaced but in most cases are imported from abroad.</p>
                                </li>
                                <li>
                                    <p>The laptop setup, software installation, and operating system customized at the time of sale are not covered by the warranty.</p>
                                </li>
                                <li>
                                    <p><strong>Appleians</strong> does not apply any kind of password or security code during the delivery of laptops, or any other products. The customer must take full responsibility for the BIOS password of laptops, or any other device. It will not be covered by the warranty.</p>
                                </li>
                                <li>
                                    <p><strong>Appleians</strong> will not be held responsible for any free software or hardware tuning provided by <strong>Appleians</strong> during or after the expiration of the warranty period.</p>
                                </li>
                                <li>
                                    <p><strong>Appleians</strong> will set the charges, in consent with the customer, for any services that are not covered by warranty.</p>
                                </li>
                                <li>
                                    <p>A laptop display with one to three dots is ineligible for warranty claims. A customer can claim warranty if there are four or more dots.</p>
                                </li>
                                <li>
                                    <p>If the serial/sticker of the product is partially or completely removed or damaged, it will no longer be able to claim warranty.</p>
                                </li>
                                <li>
                                    <p>If the user writes anything with permanent ink on the product, it will void the warranty.</p>
                                </li>
                                <li>
                                    <p>The warranty does not cover any damage to cables provided with a product regardless of a valid product warranty.</p>
                                </li>
                                <li>
                                    <p>If the warranty receipt paper of a particular product is lost, the product must be accepted subject to the receipt of its purchase and the provision of proper proof.</p>
                                </li>
                            </ul>

                            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Service Warranty Terms and Conditions:</h3>
                            <ul className="space-y-4 list-disc pl-5">
                                <li>If the product repair in another service provider then <strong>Appleians</strong> service warranty will be void.</li>
                                <li>In service warranty, no other laptop accessories (Charger, Cable, Convertor, etc.) are not valid for service warranty.</li>
                                <li>Customer will bear the transportation cost for any service-related issues.</li>
                                <li>In case of service warranty, if any parts need to be changed or added Customer will bear the cost of parts if required.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
