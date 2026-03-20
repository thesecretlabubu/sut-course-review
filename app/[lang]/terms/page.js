import { getDictionary } from '@/lib/i18n'

export async function generateMetadata({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return {
    title: `${dict.terms.title} — SUT Course Review`,
  }
}

export default async function TermsPage({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-[#f3f4f5] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-10 shadow-sm">
          <h1 className="text-3xl font-extrabold text-[#191c1d] mb-2" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
            {dict.terms.title}
          </h1>
          <p className="text-xs text-[#6e7b6c] mb-8">{dict.terms.lastUpdated}</p>

          <div className="space-y-8 text-sm text-[#3e4a3d] leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">{dict.terms.section1Title}</h2>
              <p>{dict.terms.section1Desc}</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">{dict.terms.section2Title}</h2>
              <p>{dict.terms.section2Desc}</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">{dict.terms.section3Title}</h2>
              <ul className="list-disc list-inside space-y-1 text-[#6e7b6c]">
                <li>{dict.terms.section3Item1}</li>
                <li>{dict.terms.section3Item2}</li>
                <li>{dict.terms.section3Item3}</li>
                <li>{dict.terms.section3Item4}</li>
                <li>{dict.terms.section3Item5}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">{dict.terms.section4Title}</h2>
              <p>{dict.terms.section4Desc}</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">{dict.terms.section5Title}</h2>
              <p>{dict.terms.section5Desc}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
