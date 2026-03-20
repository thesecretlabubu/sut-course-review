import { getDictionary } from '@/lib/i18n'
import Link from 'next/link'

export async function generateMetadata({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return {
    title: `${dict.privacy.title} — SUT Course Review`,
  }
}

export default async function PrivacyPage({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-[#f3f4f5] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-10 shadow-sm">
          <h1 className="text-3xl font-extrabold text-[#191c1d] mb-2" style={{ fontFamily: 'Manrope, Sarabun, sans-serif' }}>
            {dict.privacy.title}
          </h1>
          <p className="text-xs text-[#6e7b6c] mb-8">{dict.privacy.lastUpdated}</p>

          <div className="space-y-8 text-sm text-[#3e4a3d] leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">{dict.privacy.section1Title}</h2>
              <p>{dict.privacy.section1Desc}</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">{dict.privacy.section2Title}</h2>
              <ul className="list-disc list-inside space-y-1 text-[#6e7b6c]">
                <li>{dict.privacy.section2Item1}</li>
                <li>{dict.privacy.section2Item2}</li>
                <li>{dict.privacy.section2Item3}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">{dict.privacy.section3Title}</h2>
              <p>{dict.privacy.section3Desc}</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">{dict.privacy.section4Title}</h2>
              <p>{dict.privacy.section4Desc}</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#191c1d] mb-2">{dict.privacy.section5Title}</h2>
              <p>{dict.privacy.section5Desc}
                <Link href={`/${lang}/contact`} className="text-[#006b2c] hover:underline">{dict.privacy.contactUs}</Link>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
