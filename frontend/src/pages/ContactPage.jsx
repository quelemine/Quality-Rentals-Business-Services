import React from 'react';

const ContactPage = () => (
  <div className="bg-slate-50 py-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
        <p className="text-sm uppercase tracking-[0.2em] text-gold">Contact</p>
        <h1 className="mt-3 text-4xl font-bold text-navy">Let’s plan your next event</h1>
        <p className="mt-4 text-lg text-slate-600">Reach out to our team for rental pricing, availability, and event support.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Phone</p>
            <a href="tel:+231776748152" className="mt-3 block text-xl font-semibold text-navy">+231 7767 48152</a>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Email</p>
            <a href="mailto:paye.susanna@yahoo.com" className="mt-3 block text-xl font-semibold text-navy">paye.susanna@yahoo.com</a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPage;
