import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function CultureGuide() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('workplace')
  const [expandedItem, setExpandedItem] = useState(null)

  const categories = [
    { id: 'workplace', icon: '🏢', title: 'Workplace' },
    { id: 'social', icon: '🤝', title: 'Social Life' },
    { id: 'holidays', icon: '🍁', title: 'Holidays' },
    { id: 'food', icon: '🍽️', title: 'Food Culture' },
    { id: 'transport', icon: '🚌', title: 'Transportation' },
    { id: 'healthcare', icon: '🏥', title: 'Healthcare' },
    { id: 'education', icon: '📚', title: 'Education' },
    { id: 'banking', icon: '🏦', title: 'Banking' },
  ]

  const content = {
    workplace: [
      {
        title: 'Punctuality is Very Important',
        content: 'In Canada, being on time is a sign of respect. Always arrive 5-10 minutes early for job interviews and meetings. If you are going to be late, always call or text ahead to let people know.',
        tip: 'Set two alarms for important meetings!'
      },
      {
        title: 'First Name Culture',
        content: 'Canadians are very informal at work. Most workplaces use first names even with managers and bosses. You can call your manager by their first name unless they tell you otherwise.',
        tip: 'If unsure, ask "What would you like me to call you?"'
      },
      {
        title: 'Work-Life Balance',
        content: 'Canadians value work-life balance. It is normal to leave work exactly at 5pm. You are not expected to work unpaid overtime. Taking your lunch break is encouraged and normal.',
        tip: 'Always take your full lunch break!'
      },
      {
        title: 'Saying Sorry',
        content: 'Canadians say sorry very often — even when something is not their fault. If you bump into someone, both people will say sorry! This is just polite Canadian culture.',
        tip: 'When in doubt, say sorry and smile!'
      },
      {
        title: 'Email Etiquette',
        content: 'Always start emails with "Hi [Name]," and end with "Thank you" or "Best regards". Keep emails short and professional. Reply to emails within 24 hours.',
        tip: 'Always proofread before sending!'
      },
      {
        title: 'Feedback Culture',
        content: 'Canadians give feedback in a very polite and indirect way. Instead of saying "This is wrong", they say "I think this could be improved". Always be open to feedback.',
        tip: 'Take feedback as an opportunity to grow!'
      },
    ],
    social: [
      {
        title: 'Small Talk is Important',
        content: 'Canadians love small talk — talking about weather, sports (especially hockey!), and weekend plans. This builds relationships. Common phrases: "How was your weekend?" "Cold enough for you?"',
        tip: 'Learn about hockey — it is Canada\'s favourite sport!'
      },
      {
        title: 'Personal Space',
        content: 'Canadians like personal space — about an arm\'s length distance when talking. They greet with a handshake, not a kiss on the cheek like some cultures. Good friends may hug.',
        tip: 'A firm handshake and eye contact makes a great first impression!'
      },
      {
        title: 'Tipping Culture',
        content: 'Tipping is expected in Canada. Restaurant servers: 15-20%. Hair stylists: 15-20%. Taxi/Uber drivers: 10-15%. Not tipping is considered rude.',
        tip: 'A quick way to calculate 15% tip: move the decimal and multiply by 1.5'
      },
      {
        title: 'Diversity and Inclusion',
        content: 'Canada is very multicultural and proud of it. Canadians are generally very welcoming of different cultures, religions and backgrounds. Discrimination is taken very seriously.',
        tip: 'Share your culture! Canadians love learning about other cultures.'
      },
      {
        title: 'Queuing (Standing in Line)',
        content: 'Canadians take queuing very seriously. Always stand in line and wait your turn. Cutting in line is considered very rude. Even if the line is long, be patient.',
        tip: 'If you accidentally cut a line, apologize immediately!'
      },
      {
        title: 'Holding Doors Open',
        content: 'It is very common and polite to hold the door open for the person behind you. If someone holds a door for you, always say "Thank you". This is basic Canadian politeness.',
        tip: 'Always say thank you when someone holds a door!'
      },
    ],
    holidays: [
      {
        title: 'Canada Day — July 1st',
        content: 'Canada\'s birthday! Celebrates when Canada became a country in 1867. There are fireworks, parades and outdoor events everywhere. Wear red and white!',
        tip: 'Great day to meet neighbours and explore your city!'
      },
      {
        title: 'Thanksgiving — Second Monday of October',
        content: 'Canadian Thanksgiving is in October (earlier than American). Families gather for a big meal with turkey, stuffing and pumpkin pie. It is about being grateful.',
        tip: 'If invited to someone\'s Thanksgiving, bring a dessert or wine!'
      },
      {
        title: 'Christmas — December 25th',
        content: 'Very widely celebrated even by non-Christians. Most businesses close. Gift giving, family dinners and decorations are common. Many Canadians say "Happy Holidays" to be inclusive.',
        tip: 'Say "Happy Holidays" to be inclusive to everyone!'
      },
      {
        title: 'Victoria Day — Monday before May 25th',
        content: 'A long weekend celebrating Queen Victoria\'s birthday. Known as the unofficial start of summer. Fireworks are common on Victoria Day evening.',
        tip: 'Great time for your first Canadian camping trip!'
      },
      {
        title: 'Remembrance Day — November 11th',
        content: 'A very solemn day to honour soldiers who died in wars. Many people wear a red poppy pin. There is a moment of silence at 11am. Most stores close.',
        tip: 'Wear a red poppy and observe the moment of silence at 11am.'
      },
      {
        title: 'Halloween — October 31st',
        content: 'Children dress in costumes and go door-to-door saying "Trick or Treat" for candy. Adults also celebrate with parties. Decorating your home is common and fun.',
        tip: 'Buy candy to give to children who knock on your door!'
      },
    ],
    food: [
      {
        title: 'Poutine',
        content: 'Canada\'s most famous dish! French fries topped with cheese curds and brown gravy. Originally from Quebec but now found everywhere. A must-try Canadian experience!',
        tip: 'Try it from a local diner for the authentic experience!'
      },
      {
        title: 'Tim Hortons',
        content: 'Tim Hortons is more than a coffee shop — it is a Canadian institution! "Double double" means coffee with two creams and two sugars. Timbits are small donut holes.',
        tip: 'Ordering a "double double" makes you sound like a true Canadian!'
      },
      {
        title: 'Dining Out Tips',
        content: 'Tax is not included in menu prices — expect to pay 13% HST on top. Tipping 15-20% is expected. Splitting bills is very common and normal to ask for.',
        tip: 'Ask "Can we get separate bills?" when dining with friends!'
      },
      {
        title: 'Grocery Shopping',
        content: 'Bring your own reusable bags — stores charge for plastic bags. Most stores are open 7 days a week. Farmers markets are popular on weekends for fresh local produce.',
        tip: 'Keep reusable bags by your door so you never forget them!'
      },
    ],
    transport: [
      {
        title: 'Public Transit',
        content: 'Most cities have buses and subways (called TTC in Toronto, STM in Montreal). Buy a monthly pass to save money. Always give up your seat to elderly, pregnant or disabled passengers.',
        tip: 'Get a transit app like Transit App to track buses in real time!'
      },
      {
        title: 'Driving in Canada',
        content: 'Drive on the right side of the road. Speed limits are in km/h. Right turn on red is allowed in most provinces except Quebec. Winter tires are mandatory in some provinces.',
        tip: 'Get your G1 license as soon as possible if you plan to drive!'
      },
      {
        title: 'Winter Driving',
        content: 'Canadian winters are serious. Roads get very icy and snowy. Give extra space between cars. Drive slowly. Many Canadians warm up their car for 10 minutes before driving.',
        tip: 'Take a winter driving course — it could save your life!'
      },
      {
        title: 'Uber and Lyft',
        content: 'Uber and Lyft are widely available in Canadian cities. They are safe and reliable. Always check the driver\'s rating and confirm the car model before getting in.',
        tip: 'Share your trip details with someone when travelling alone at night!'
      },
    ],
    healthcare: [
      {
        title: 'OHIP — Free Healthcare',
        content: 'Ontario Health Insurance Plan (OHIP) gives you free doctor visits and hospital care. Apply for your health card as soon as you arrive. Takes about 3 months to activate.',
        tip: 'Apply for your health card on your first week in Ontario!'
      },
      {
        title: 'Finding a Family Doctor',
        content: 'Having a family doctor (GP) is very important. Use Health Care Connect to find one. Walk-in clinics are available if you don\'t have a doctor yet.',
        tip: 'Register with Health Care Connect at ontario.ca/page/health-care-connect'
      },
      {
        title: 'Calling 911',
        content: 'Call 911 for police, fire or medical emergencies only. For non-emergencies call your local police non-emergency line. Calling 911 for non-emergencies can result in a fine.',
        tip: 'Save your local non-emergency police number in your phone!'
      },
      {
        title: 'Pharmacy',
        content: 'Pharmacists in Canada are very helpful. You can ask them questions about medications for free. Many common medications require a prescription from a doctor.',
        tip: 'Shoppers Drug Mart and Rexall are common pharmacy chains!'
      },
    ],
    education: [
      {
        title: 'School System',
        content: 'School is free from Kindergarten to Grade 12. Children must attend school until age 16. School year runs September to June. There are public, Catholic and French schools.',
        tip: 'Register your children for school as soon as you arrive!'
      },
      {
        title: 'College vs University',
        content: 'College offers practical 2-3 year programs. University offers 4-year degree programs. Both are respected. College is often better for getting a job quickly.',
        tip: 'Research both options carefully before deciding!'
      },
      {
        title: 'English Language Classes',
        content: 'Free English classes (LINC) are available for newcomers. Settlement agencies offer free programs. Libraries also offer free English conversation groups.',
        tip: 'Search for LINC classes in your city — they are completely free!'
      },
      {
        title: 'Canadian Credential Recognition',
        content: 'Your foreign degree may need to be assessed. Use World Education Services (WES) to get your credentials evaluated. Some professions require additional Canadian certification.',
        tip: 'Get your WES assessment done early — it takes several weeks!'
      },
    ],
    banking: [
      {
        title: 'Opening a Bank Account',
        content: 'You need a bank account to receive salary, pay rent and bills. Bring your passport and proof of address. Major banks: TD, RBC, Scotiabank, BMO, CIBC. Most offer newcomer packages.',
        tip: 'TD and RBC have excellent newcomer banking packages!'
      },
      {
        title: 'Building Credit Score',
        content: 'Your credit score is very important in Canada for renting, loans and phones. Start building credit by getting a secured credit card. Always pay your full balance on time.',
        tip: 'Never miss a credit card payment — it seriously damages your score!'
      },
      {
        title: 'E-Transfer',
        content: 'Interac e-Transfer is the most common way to send money between Canadian bank accounts. It is instant, free and very safe. Used for splitting bills, paying rent etc.',
        tip: 'Set up e-Transfer autodeposit so money goes straight to your account!'
      },
      {
        title: 'Taxes in Canada',
        content: 'Everyone must file taxes by April 30th every year. Use free tax software like SimpleTax or visit a free tax clinic. You may get money back called a tax refund!',
        tip: 'File your taxes even if you earned very little — you may get money back!'
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#EAF4EC]">

      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">BridgeVoice</h1>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
          <Link to="/profile" className="text-gray-600 hover:text-blue-600 font-medium">Profile</Link>
          <button
            onClick={() => { localStorage.clear(); navigate('/') }}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-700">🍁 Canadian Culture Guide</h2>
          <p className="text-gray-500">Everything you need to know about life in Canada</p>
        </div>

        <div className="bg-blue-600 rounded-2xl p-6 mb-8 text-white">
          <h3 className="text-xl font-bold mb-2">Welcome to Canada! 🍁</h3>
          <p className="text-blue-100">This guide will help you understand Canadian culture, workplace etiquette, and daily life so you can feel confident and comfortable in your new home.</p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setExpandedItem(null) }}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium">{cat.title}</span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {content[activeCategory].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setExpandedItem(expandedItem === i ? null : i)}
                className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <p className="font-semibold text-gray-700">{item.title}</p>
                <span className="text-gray-400 text-xl">{expandedItem === i ? '−' : '+'}</span>
              </button>

              {expandedItem === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed mb-4">{item.content}</p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
                    <p className="text-sm font-semibold text-yellow-700 mb-1">💡 Pro Tip</p>
                    <p className="text-sm text-gray-600">{item.tip}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default CultureGuide