import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Team from "./components/Team";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ServiceModal from "@/components/ServiceModal";
import { getSiteSettings, getFeaturedProjects, getTeamMembers } from "@/lib/sanity";

export default async function Home() {
  const [settings, featuredProjects, teamMembers] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
    getTeamMembers(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero
          heroTagline={settings?.heroTagline}
          heroGoldWord={settings?.heroGoldWord}
          heroSubtitle={settings?.heroSubtitle}
          heroCtaPrimary={settings?.heroCtaPrimary}
          heroCtaSecondary={settings?.heroCtaSecondary}
        />
        <About
          aboutLabel={settings?.aboutLabel}
          aboutHeading={settings?.aboutHeading}
          aboutHeadingGoldWords={settings?.aboutHeadingGoldWords}
          aboutBody={settings?.aboutBody}
          statOneValue={settings?.statOneValue}
          statOneLabel={settings?.statOneLabel}
          statTwoValue={settings?.statTwoValue}
          statTwoLabel={settings?.statTwoLabel}
          statThreeValue={settings?.statThreeValue}
          statThreeLabel={settings?.statThreeLabel}
        />
        <Services
          servicesLabel={settings?.servicesLabel}
          servicesHeading={settings?.servicesHeading}
          servicesHeadingGoldWord={settings?.servicesHeadingGoldWord}
          serviceOneTitle={settings?.serviceOneTitle}
          serviceOneSubtitle={settings?.serviceOneSubtitle}
          serviceOneDescription={settings?.serviceOneDescription}
          serviceTwoTitle={settings?.serviceTwoTitle}
          serviceTwoSubtitle={settings?.serviceTwoSubtitle}
          serviceTwoDescription={settings?.serviceTwoDescription}
          serviceThreeTitle={settings?.serviceThreeTitle}
          serviceThreeSubtitle={settings?.serviceThreeSubtitle}
          serviceThreeDescription={settings?.serviceThreeDescription}
        />
        <Projects projects={featuredProjects} />
        <Team members={teamMembers} />
        <Contact
          contactLabel={settings?.contactLabel}
          contactHeading={settings?.contactHeading}
          contactHeadingGoldWord={settings?.contactHeadingGoldWord}
          contactSubtext={settings?.contactSubtext}
          contactEmail={settings?.contactEmail}
          contactLocation={settings?.contactLocation}
        />
      </main>
      <Footer
        footerCopyright={settings?.footerCopyright}
        footerTagline={settings?.footerTagline}
      />
      <ServiceModal
        serviceOneTitle={settings?.serviceOneTitle}
        serviceOneModalDescription={settings?.serviceOneModalDescription}
        serviceOneServices={settings?.serviceOneServices}
        serviceTwoTitle={settings?.serviceTwoTitle}
        serviceTwoModalDescription={settings?.serviceTwoModalDescription}
        serviceTwoServices={settings?.serviceTwoServices}
        serviceThreeTitle={settings?.serviceThreeTitle}
        serviceThreeModalDescription={settings?.serviceThreeModalDescription}
        serviceThreeServices={settings?.serviceThreeServices}
      />
    </>
  );
}
