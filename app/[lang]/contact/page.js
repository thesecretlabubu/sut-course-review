import { getDictionary } from '@/lib/i18n'
import ContactForm from '@/app/components/ContactForm'

export async function generateMetadata({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return {
    title: `${dict.contact.title} — SUT Course Review`,
  }
}

export default async function Page({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return <ContactForm lang={lang} dict={dict} />
}
