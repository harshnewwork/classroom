import { siteConfig } from '../config/siteConfig';

/**
 * Mentors Studio — Comprehensive FAQ Bank
 *
 * Sourced from Section 9.1 & 9.2 of the SEO Strategy.
 * Structured with full question & answer pairs suitable for both on-page accordion UI
 * and schema.org FAQPage JSON-LD rich results.
 */

export const FAQS = [
  {
    id: 'pricing-cost',
    category: 'Pricing & Billing',
    question: 'How much does it cost to rent a classroom in Gurugram at Mentors Studio?',
    answer: `Classroom rental at Mentors Studio follows a transparent pay-per-seat, per-session model. School educator sessions start at ₹${siteConfig.rates.schoolPerSession} per seat, while adult and professional coaching sessions start at ₹${siteConfig.rates.adultPerSession} per seat (excl. GST). Long-term packages (Starter, Standard, Half-Yearly, and Annual) provide savings of 5% to 20% off the base rate, bringing per-seat costs as low as ₹200 for adult batches and ₹160 for school batches.`,
  },
  {
    id: 'deposit',
    category: 'Pricing & Billing',
    question: 'Is there a deposit to start teaching?',
    answer: 'There is zero security deposit and no upfront lock-in for our Pay As You Go and Starter packages — you only pay monthly for the sessions you teach. For multi-month packages (Standard, Half-Yearly, and Annual) that secure preferred recurring slots and volume discounts, a modest security deposit is required and is 100% refundable upon completing your package term.',
  },
  {
    id: 'booking-options',
    category: 'Booking & Commitment',
    question: 'Can I rent a classroom by the session, or only in monthly packages?',
    answer: 'You can rent by individual sessions under our Pay As You Go model, with a recommended minimum commitment of at least 3 teaching days per week and 2 sessions per day to maintain continuity for your learners. For established educators running consistent batches, structured packages (36 to 288 sessions) offer substantial discounts and guaranteed room reservations.',
  },
  {
    id: 'inclusions',
    category: 'Facilities & Tech',
    question: "What's included in the rent — do I need to bring my own AC, Wi-Fi, or projector?",
    answer: 'Everything is fully included with no separate utility bills or setup fees. Every classroom cabin comes furnished with climate-controlled AC, high-speed broadband Wi-Fi, digital displays (TV or HDMI projector), whiteboards with markers, in-cabin laptops for presentations, daily housekeeping, CCTV in common corridors, and an on-site manager and IT technician to handle equipment.',
  },
  {
    id: 'location-directions',
    category: 'Location & Access',
    question: 'Where exactly is Mentors Studio located relative to Golf Course Extension Road and Sector 57?',
    answer: `Mentors Studio is located in a prominent commercial mall directly on Golf Course Extension Road, Sector 57, Gurugram, Haryana 122003. This central micro-market sits minutes from Sushant Lok II/III, Sector 56 Metro Station, Sohna Road, and Golf Course Road, making it readily accessible for students commuting from DLF Phase 5, Nirvana Country, and across New Gurgaon.`,
  },
  {
    id: 'age-groups-subjects',
    category: 'Programmes & Rules',
    question: 'What age groups and subjects are allowed in the classrooms?',
    answer: 'We welcome adult learners of all ages during morning and afternoon slots (10:00 am to 3:28 pm) for programmes like IELTS/TOEFL, spoken English, coding, AutoCAD, digital marketing, and professional skills. Evening slots (from 3:30 pm) and weekends cater to school students from Grade 5 and above for academic tuition, board exam prep, and arts/botany. To ensure a focused academic atmosphere, dance, loud music, and pre-nursery programmes are not accommodated.',
  },
  {
    id: 'recording-classes',
    category: 'Facilities & Tech',
    question: 'Can I record my sessions for content or review?',
    answer: 'Yes. Audio and video recording can be arranged upon prior request with our on-site IT technician. You can record lectures for review, hybrid student delivery, or digital course creation. All recorded footage remains your 100% exclusive intellectual property and is never shared with third parties.',
  },
  {
    id: 'min-billing-calculation',
    category: 'Pricing & Billing',
    question: 'How is billing calculated if fewer students show up than expected (minimum billable seats)?',
    answer: 'To reserve a dedicated cabin exclusively for your batch, each room requires a minimum billable seat threshold set at 60% of capacity, rounded up (for example, 4 seats in a 6-seat cabin, 6 seats in a 10-seat cabin, or 15 seats in a 24-seat seminar room). If fewer students attend on a given day, you are billed only for that minimum; when attendance exceeds the minimum, you pay only for the exact seats occupied.',
  },
  {
    id: 'parking',
    category: 'Location & Access',
    question: 'Is parking available for students and educators?',
    answer: 'Yes, convenient vehicle parking is available within the mall complex for both educators and visiting students/parents, ensuring seamless drop-offs and pick-ups on Golf Course Extension Road.',
  },
  {
    id: 'student-acquisition',
    category: 'Business Model',
    question: 'Can I bring my own students, or does Mentors Studio provide students?',
    answer: 'Mentors Studio is an infrastructure and workspace provider for independent educators, coaches, and institutes — you bring your own students, curriculum, and teaching style, while we provide the professional physical space and technology. You retain 100% of your student tuition fees, collect payments directly, and simply pay Mentors Studio for the classroom hours used.',
  },
  {
    id: 'scale-cabin-size',
    category: 'Booking & Commitment',
    question: 'What happens if I need a larger or smaller cabin later?',
    answer: 'Flexibility is a cornerstone of Mentors Studio. As your batch expands or contracts, you can request an upgrade or change of cabin size through the on-site manager. With 9 distinct cabins ranging from 6 to 24 seats plus two open-format creative areas, you can seamlessly transition between room capacities as your student enrollment grows.',
  },
  {
    id: 'sunday-classes',
    category: 'Booking & Commitment',
    question: 'Are Sunday classes possible?',
    answer: 'Yes. Mentors Studio operates Monday through Saturday from 10:00 am to 8:29 pm, and is open for teaching sessions on three designated Sundays per calendar month by prior scheduling arrangement with the facility manager. This is ideal for weekend crash courses, mock test drives, and executive workshops.',
  },
  {
    id: 'legal-operations',
    category: 'Educator Guidance',
    question: 'How do independent tutors legally operate without owning a commercial space in Gurugram?',
    answer: 'Independent tutors and educational consultants can legally deliver coaching sessions from commercially zoned, managed spaces like Mentors Studio without bearing long-term commercial lease agreements, hefty deposits, or commercial tenant liabilities. Monthly tax invoices with GST are provided for clean business accounting.',
  },
  {
    id: 'coworking-vs-classroom',
    category: 'Educator Guidance',
    question: "What's the difference between a coworking space and a classroom rental for educators?",
    answer: 'Standard coworking spaces provide hot desks or quiet meeting rooms that prohibit teaching, group lectures, or student movement. Mentors Studio is specifically engineered for education: acoustic consideration between cabins, large magnetic whiteboards, tiered seating, teacher-facing podiums, presentation screens, and dedicated reception areas built for student traffic.',
  },
  {
    id: 'cabin-capacities-layout',
    category: 'Facilities & Tech',
    question: 'How many students can an 8-seat, 12-seat, or 24-seat cabin hold comfortably?',
    answer: 'Every cabin capacity is rated for comfortable ergonomic learning with individual desks, proper sightlines to the display screen and whiteboard, and adequate aisle space. Our 6-seat and 8-seat cabins are tailored for personalized tutoring, 10-seat and 12-seat cabins accommodate standard school or language batches, and our 24-seat seminar hall comfortably accommodates large competitive exam batches or workshops.',
  },
];

