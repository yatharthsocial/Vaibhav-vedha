// Content for the five vertical pages (/green, /build, /learn, /advise,
// /digital). Each page is rendered by components/vertical/VerticalPage
// from the entry here: a hero, an intro statement, the five focus
// areas, then a run of content blocks, and a closing call to action.

export type VerticalSlug = "green" | "build" | "learn" | "advise" | "digital";

// image is optional — until one is set, the page rotates through the
// vertical images as placeholders.
export type FocusArea = {
  title: string;
  kicker: string;
  text: string;
  image?: string;
};

// The block types a page can stack between its focus areas and its
// closing section — each has its own layout in VerticalPage.
export type VerticalBlock =
  | {
      type: "statement";
      eyebrow: string;
      title: string;
      paragraphs: string[];
      chips?: string[];
      kicker?: string;
    }
  | {
      type: "lines";
      eyebrow: string;
      title: string;
      intro?: string;
      lines: string[];
      outro?: string;
    }
  | {
      type: "chips";
      eyebrow: string;
      title: string;
      intro?: string;
      chips: string[];
      outro?: string;
    }
  | {
      type: "flow";
      eyebrow: string;
      title: string;
      steps: { title: string; text: string; highlight?: boolean }[];
    }
  | {
      type: "grid";
      eyebrow: string;
      title: string;
      intro?: string;
      items: { title: string; text: string }[];
    };

export type Vertical = {
  slug: VerticalSlug;
  name: string;
  tagline: string;
  image: string;
  hero: { title: string; lead: string };
  intro: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    kicker?: string;
    chips?: string[];
  };
  focus: FocusArea[];
  blocks: VerticalBlock[];
  closing: { title: string; text: string; ctas: string[] };
};

export const verticalPages: Vertical[] = [
  {
    slug: "green",
    name: "Green",
    tagline: "For a cleaner, greener future.",
    image: "/verticals/green.jpg",
    hero: {
      title: "A greener future begins with what we choose today.",
      lead: "Sustainability becomes meaningful when it moves from intention to action. Through Vaibhav Veda Green, we work with businesses, institutions, governments and communities to identify opportunities that support cleaner growth, responsible resource use and the evolving green economy.",
    },
    intro: {
      eyebrow: "A direction",
      title: "Green is more than a colour. It is a direction.",
      paragraphs: [
        "The way the world produces, builds, employs and grows is changing. This transition is creating new industries, new skills and new possibilities.",
        "Vaibhav Veda Green works within this changing landscape, connecting ideas with expertise, organisations with opportunities and sustainability goals with pathways for implementation.",
        "From renewable energy and green hydrogen to ESG, carbon footprint reduction and sustainability-led projects, our focus is on solutions that make environmental responsibility practical, measurable and valuable.",
      ],
      kicker:
        "Every thoughtful decision made today becomes part of a stronger tomorrow.",
    },
    focus: [
      {
        title: "Renewable Energy",
        kicker: "Energy that respects tomorrow.",
        text: "We explore opportunities and partnerships across renewable energy and the wider clean-energy ecosystem, helping create projects and collaborations that contribute to a more sustainable energy future.",
      },
      {
        title: "Green Hydrogen",
        kicker: "Powering possibilities for the next economy.",
        text: "Green hydrogen represents an important frontier in the transition towards cleaner industry and energy. Vaibhav Veda seeks to participate in this emerging ecosystem through collaboration, opportunity development and partnerships that bring together knowledge, enterprise and institutional capability.",
      },
      {
        title: "ESG & Sustainability",
        kicker: "Responsibility that becomes part of growth.",
        text: "Sustainable organisations think beyond immediate outcomes. We help bring environmental, social and governance thinking into conversations around strategy, projects and long-term growth, creating a clearer relationship between responsibility and business value.",
      },
      {
        title: "Carbon Footprint Reduction",
        kicker: "Measure today. Improve tomorrow.",
        text: "Meaningful environmental progress begins with understanding impact. We support organisations in exploring practical approaches to reducing their environmental footprint, improving resource consciousness and moving towards cleaner ways of operating.",
      },
      {
        title: "Green Jobs & Skills",
        kicker: "Preparing people for the economy that is emerging.",
        text: "A green economy needs people who are ready to build it. As renewable energy, sustainability and green technologies expand, entirely new capabilities and career pathways are taking shape. Vaibhav Veda brings skills into the sustainability conversation, connecting workforce development with emerging opportunities in the green economy.",
      },
    ],
    blocks: [
      {
        type: "statement",
        eyebrow: "From thinking to action",
        title: "From green thinking to green action.",
        paragraphs: [
          "The most valuable sustainability ideas are the ones that can move forward. That takes the right knowledge, the right partners and a shared willingness to act.",
          "Vaibhav Veda Green creates space for these connections by bringing together industry, institutions, expertise and opportunity around a common purpose.",
        ],
        kicker: "Explore. Connect. Collaborate. Create impact.",
      },
      {
        type: "lines",
        eyebrow: "Stronger partnerships",
        title: "A stronger green economy needs stronger partnerships.",
        intro: "No single sector shapes the sustainability transition alone.",
        lines: [
          "Industry brings scale.",
          "Institutions bring knowledge.",
          "Government creates enabling ecosystems.",
          "Technology brings new possibilities.",
          "People bring ideas, skills and ambition.",
        ],
        outro:
          "When these strengths come together, possibilities become projects and projects can create lasting impact. Vaibhav Veda Green seeks to become a bridge between these worlds.",
      },
      {
        type: "grid",
        eyebrow: "The impact we work towards",
        title: "What it all adds up to.",
        items: [
          { title: "Cleaner Energy", text: "For the world we share." },
          { title: "Greener Skills", text: "For the careers of tomorrow." },
          { title: "Responsible Enterprise", text: "For enduring value." },
          {
            title: "Stronger Partnerships",
            text: "For greater collective impact.",
          },
        ],
      },
    ],
    closing: {
      title: "Green today. Stronger tomorrow.",
      text: "Every solar panel installed, every skill developed, every responsible decision made and every meaningful partnership created contributes to something larger — a future where economic progress and environmental responsibility move forward together. A future worth building, and worth celebrating.",
      ctas: ["Collaborate With Vaibhav Veda Green"],
    },
  },
  {
    slug: "build",
    name: "Build",
    tagline: "Building with tomorrow in mind.",
    image: "/verticals/build.jpg",
    hero: {
      title: "Building today for generations ahead.",
      lead: "What we build becomes part of how people live, work and grow. Through Vaibhav Veda Build, we bring together planning, engineering, project management and partnerships to create infrastructure with a longer view of its value.",
    },
    intro: {
      eyebrow: "Infrastructure",
      title: "Infrastructure that moves life forward.",
      paragraphs: [
        "A building eventually becomes a workplace. A road becomes a connection. A development becomes a neighbourhood. Infrastructure becomes part of everyday life.",
        "That responsibility shapes the way we approach development. Vaibhav Veda Build works across real estate, infrastructure, project management, development partnerships and allied construction and execution opportunities.",
        "Our ambition is to bring the right capabilities around every opportunity, creating projects that are thoughtfully planned, responsibly executed and prepared for the future.",
      ],
      kicker: "Built with purpose. Designed for tomorrow.",
    },
    focus: [
      {
        title: "Green Buildings",
        kicker: "Better spaces begin with better thinking.",
        text: "The buildings of tomorrow will be expected to do more with less. Vaibhav Veda explores development approaches where sustainability can become part of the way spaces are conceived, planned and delivered.",
      },
      {
        title: "Smart Infrastructure",
        kicker: "Infrastructure ready for a changing world.",
        text: "Cities are evolving. Communities are expanding. Technology is changing how infrastructure is planned, managed and experienced. We bring together development thinking, partnerships and emerging possibilities to help create infrastructure that responds intelligently to the needs of tomorrow.",
      },
      {
        title: "Project Management",
        kicker: "From an idea on paper to a place with purpose.",
        text: "Good projects depend on thousands of decisions coming together at the right time. We approach project management with structure, coordination and accountability, connecting stakeholders and capabilities around a shared objective from planning through execution.",
      },
      {
        title: "Construction & Engineering",
        kicker: "Where vision takes physical form.",
        text: "Strong execution begins with clarity. Through collaboration with engineering, construction and project partners, we work towards translating development concepts into well-planned, functional and enduring assets.",
      },
      {
        title: "Asset Management",
        kicker: "Creating value beyond completion.",
        text: "The life of an asset continues long after it is built. Our approach considers how infrastructure can remain useful, efficient and valuable over time, bringing a long-term perspective to the management and development of built assets.",
      },
    ],
    blocks: [
      {
        type: "chips",
        eyebrow: "Collaboration",
        title: "Every project is a collaboration.",
        intro:
          "Behind every successful development are people with different responsibilities working towards the same outcome.",
        chips: [
          "Developers",
          "Engineers",
          "Architects",
          "Institutions",
          "Government bodies",
          "Investors",
          "Technology partners",
          "Communities",
        ],
        outro:
          "Vaibhav Veda Build believes in bringing these perspectives together early, creating stronger alignment between ambition, execution and long-term value. When expertise comes together, stronger foundations follow.",
      },
      {
        type: "lines",
        eyebrow: "Built for people",
        title:
          "The true measure of infrastructure is found in the lives around it.",
        lines: [
          "In the family that calls a place home.",
          "In the business that finds room to grow.",
          "In the community that becomes better connected.",
          "In the city that becomes more liveable.",
        ],
        outro:
          "That human perspective matters to us because development ultimately has a very simple purpose: to make progress possible.",
      },
      {
        type: "grid",
        eyebrow: "Green + Build",
        title: "From sustainable thinking to sustainable places.",
        intro:
          "Vaibhav Veda's five verticals are designed to complement one another — an ecosystem where different capabilities come together around a project.",
        items: [
          {
            title: "Green",
            text: "Sustainability thinking can inform infrastructure.",
          },
          { title: "Learn", text: "Skills can meet employment opportunities." },
          { title: "Advise", text: "Advisory can support better decisions." },
          {
            title: "Digital",
            text: "Digital solutions can improve how assets are managed.",
          },
        ],
      },
    ],
    closing: {
      title: "We build with tomorrow in the room.",
      text: "Every project leaves something behind — a structure, an opportunity, a connection, a place where life happens. Our responsibility is to make what we create today worthy of the tomorrow it will become part of.",
      ctas: ["Build With Us"],
    },
  },
  {
    slug: "learn",
    name: "Learn",
    tagline: "Skills that open doors.",
    image: "/verticals/learn.jpg",
    hero: {
      title: "Skills for tomorrow. Opportunities for life.",
      lead: "Education gives us knowledge. The right skills give us the confidence to use it. Vaibhav Veda Learn brings education and industry closer, creating learning pathways shaped by the skills workplaces need and the ambitions of people preparing for their future.",
    },
    intro: {
      eyebrow: "Classroom to career",
      title: "Learning should lead somewhere.",
      paragraphs: [
        "A certificate has value. A skill has possibility. And when that skill connects a person to meaningful work, it can change the direction of a life.",
        "There is often a distance between what someone studies and what an industry expects. We want to bring those worlds closer.",
        "By understanding industry requirements and working with academic and institutional partners, Vaibhav Veda Learn seeks to create programmes that combine knowledge with practical capability, exposure and employability.",
      ],
      kicker: "Learn. Apply. Grow.",
    },
    focus: [
      {
        title: "Vocational Training",
        kicker: "Skills you can carry into the real world.",
        text: "Practical learning creates confidence. Our vocational programmes are envisioned around capabilities that can be understood, practised and applied, helping learners become better prepared for real opportunities.",
      },
      {
        title: "Industry-Specific Programmes",
        kicker: "Learn what the industry is looking for.",
        text: "Industries evolve quickly. Skills must evolve with them. We work towards programmes shaped around sector requirements, bringing industry perspectives into learning so participants gain familiarity with the expectations, tools and capabilities relevant to their chosen fields.",
      },
      {
        title: "University & Institutional Collaborations",
        kicker: "When academia and industry learn from each other.",
        text: "Universities shape minds. Industry understands changing market realities. Vaibhav Veda seeks to build meaningful institutional partnerships around industry programmes, skills, internships, employability and practical exposure.",
      },
      {
        title: "Certification Programmes",
        kicker: "Give your skills a direction.",
        text: "Professional learning continues far beyond formal education. Our certification programmes are envisioned for students and professionals who want to strengthen specific capabilities, stay relevant to changing industries and prepare for emerging opportunities.",
      },
      {
        title: "Green Jobs Training",
        kicker: "Preparing people for a greener economy.",
        text: "The transition towards sustainability is also a transition in employment. Renewable energy, sustainability and emerging green industries are creating new roles — Vaibhav Veda Learn aims to help people prepare for this changing landscape through skills aligned with the green economy.",
      },
    ],
    blocks: [
      {
        type: "flow",
        eyebrow: "Connecting four worlds",
        title: "From potential to possibility.",
        steps: [
          { title: "Students", text: "Ambition & potential" },
          { title: "Academia", text: "Knowledge & learning" },
          {
            title: "Vaibhav Veda Learn",
            text: "Connecting potential with possibility",
            highlight: true,
          },
          { title: "Industry", text: "Skills & opportunities" },
          { title: "Employment", text: "Careers & economic value" },
        ],
      },
      {
        type: "lines",
        eyebrow: "More than careers",
        title: "A skilled person earns more than a qualification.",
        lines: [
          "They gain confidence.",
          "They become more independent.",
          "They bring greater value to their workplace.",
          "They can create opportunities for their family.",
          "And eventually, they strengthen an entire economy.",
        ],
        outro:
          "Behind every skilled workforce is a collection of individual dreams.",
      },
      {
        type: "statement",
        eyebrow: "Green + Learn",
        title: "Where Green meets Learn.",
        paragraphs: [
          "Green looks towards the industries of tomorrow. Learn prepares people to participate in them.",
          "As sustainability creates new sectors, technologies and employment opportunities, the workforce supporting that transformation must grow alongside it.",
        ],
        kicker: "Create green opportunities. Prepare people for them.",
      },
      {
        type: "lines",
        eyebrow: "Why we invest in people",
        title: "A skill can change a story.",
        lines: [
          "For one person, it could mean their first job.",
          "For another, a move into a new industry.",
          "For a professional, the next stage of a career.",
          "For an entrepreneur, the beginning of an enterprise.",
          "For a community, thousands of such stories become progress.",
        ],
        outro:
          "When people become stronger, institutions, industries and communities become stronger — and tomorrow becomes stronger.",
      },
    ],
    closing: {
      title: "Learn today. Lead tomorrow.",
      text: "The future belongs to people who are prepared to keep learning, adapting and creating. We want to help build that generation — with skills in their hands, confidence in their abilities and opportunities ahead of them.",
      ctas: ["Learn With Vaibhav Veda", "Partner With Us"],
    },
  },
  {
    slug: "advise",
    name: "Advise",
    tagline: "Clarity for meaningful growth.",
    image: "/verticals/advise.jpg",
    hero: {
      title: "Perspective that moves ideas forward.",
      lead: "Good decisions begin with understanding the bigger picture. Vaibhav Veda Advise brings together business insight, institutional understanding, sector knowledge and relationships to help organisations navigate opportunities with greater clarity.",
    },
    intro: {
      eyebrow: "The right perspective",
      title: "Every opportunity needs the right perspective.",
      paragraphs: [
        "An idea may begin in a boardroom, a government department, an institution or with an entrepreneur. Taking it forward often means understanding many worlds at once.",
        "We work across strategy, sustainability, skills, policy environments and institutional partnerships, helping bring the right people and perspectives to the table.",
      ],
      chips: [
        "Business realities",
        "Government frameworks",
        "Industry expectations",
        "Institutional processes",
        "People and skills",
        "Long-term sustainability",
      ],
      kicker: "Think clearly. Connect meaningfully. Move forward confidently.",
    },
    focus: [
      {
        title: "ESG Advisory",
        kicker: "Turning responsibility into direction.",
        text: "Environmental, social and governance considerations increasingly influence how organisations plan, operate and grow. We help bring sustainability thinking into strategic conversations, connecting environmental responsibility, people and governance with practical business priorities.",
      },
      {
        title: "Policy & Regulatory Support",
        kicker: "Understanding the landscape before moving through it.",
        text: "Strong ideas move faster when organisations understand the environment around them. Vaibhav Veda supports businesses and projects in navigating relevant institutional and regulatory landscapes, identifying the stakeholders, frameworks and relationships that can shape progress.",
      },
      {
        title: "Skill Council Consulting",
        kicker: "Connecting skills with industry.",
        text: "Workforce development becomes stronger when the skills being taught reflect where industries are heading. We bring an understanding of skill ecosystems, industry requirements and institutional collaboration to conversations around workforce development and employability.",
      },
      {
        title: "Business Strategy",
        kicker: "From ambition to a clearer way forward.",
        text: "Growth begins with knowing where you want to go and understanding what it will take to get there. We work with organisations, entrepreneurs and project stakeholders to explore opportunities, develop partnerships and shape strategies around sustainable and scalable growth.",
      },
      {
        title: "Government & Institutional Relations",
        kicker: "Building meaningful bridges.",
        text: "Some opportunities require many stakeholders to move together. Vaibhav Veda brings experience in institutional engagement and partnership development — bringing the right people into the right conversation across government, industry, academia and enterprise.",
      },
    ],
    blocks: [
      {
        type: "flow",
        eyebrow: "From conversation to collaboration",
        title: "We see advisory as a journey.",
        steps: [
          { title: "Understand", text: "Listen to the ambition." },
          {
            title: "Connect",
            text: "Bring relevant people and possibilities together.",
          },
          {
            title: "Strategise",
            text: "Create clarity around the way forward.",
            highlight: true,
          },
          {
            title: "Collaborate",
            text: "Align stakeholders around shared outcomes.",
          },
          {
            title: "Grow",
            text: "Build relationships capable of creating lasting value.",
          },
        ],
      },
      {
        type: "lines",
        eyebrow: "The power of the right connection",
        title: "Progress begins when strengths find one another.",
        lines: [
          "Sometimes an organisation already has the idea.",
          "Another has the expertise.",
          "An institution has the knowledge.",
          "Industry has the requirement.",
          "Government has an enabling ecosystem.",
          "An investor sees the potential.",
        ],
        outro:
          "That is where collaboration becomes powerful. One table. Different perspectives. Shared progress.",
      },
      {
        type: "grid",
        eyebrow: "Advice should lead to action",
        title: "The standard we hold ourselves to.",
        intro:
          "A strategy becomes valuable when people can act on it. A partnership becomes meaningful when it creates an outcome.",
        items: [
          { title: "Clarity", text: "In thinking." },
          { title: "Credibility", text: "In relationships." },
          { title: "Purpose", text: "In collaboration." },
          { title: "Progress", text: "In action." },
        ],
      },
    ],
    closing: {
      title: "The right conversation can change what comes next.",
      text: "Whether you are exploring a new opportunity, developing a project, building an institutional partnership or preparing for growth, the first step can simply be sitting down with the right people. Let's start that conversation.",
      ctas: ["Speak With Vaibhav Veda"],
    },
  },
  {
    slug: "digital",
    name: "Digital",
    tagline: "Technology that moves ideas forward.",
    image: "/verticals/digital.jpg",
    hero: {
      title: "Technology that makes progress possible.",
      lead: "Technology matters most when it makes something better. Vaibhav Veda Digital creates digital solutions and platforms that help organisations work intelligently, connect effectively and grow with greater reach.",
    },
    intro: {
      eyebrow: "Simpler, not louder",
      title: "Digital should make things feel simpler.",
      paragraphs: [
        "The best technology quietly improves the way things work. It connects information. It reduces distance. It makes knowledge accessible.",
        "It gives people better visibility and helps organisations respond faster — a process becomes simpler, a decision smarter, and learning reaches more people.",
      ],
      kicker: "Human purpose. Digital possibility.",
    },
    focus: [
      {
        title: "Digital Solutions",
        kicker: "Technology shaped around real needs.",
        text: "Every organisation works differently. We explore digital solutions around the people, processes and outcomes they are meant to support, creating opportunities for technology to improve efficiency, access and everyday operations.",
      },
      {
        title: "E-Learning Platforms",
        kicker: "Learning without boundaries.",
        text: "A learner's opportunity should not depend on where they are. Through technology-enabled learning platforms, Vaibhav Veda connects the strength of Learn with the reach of Digital, creating new possibilities for education, certification and workforce development.",
      },
      {
        title: "Smart Monitoring Systems",
        kicker: "See more. Understand sooner. Act better.",
        text: "Good management depends on visibility. Smart monitoring helps organisations and project teams understand performance, identify changes and make better-informed decisions across infrastructure, sustainability and enterprise.",
      },
      {
        title: "Data & Analytics",
        kicker: "Better information creates better decisions.",
        text: "Every organisation generates information. Its real value appears when it helps people understand what is happening and decide what should happen next — supporting planning, performance monitoring and strategic decision-making.",
      },
      {
        title: "GreenTech",
        kicker: "Where sustainability meets innovation.",
        text: "Digital tools can help organisations understand consumption, monitor environmental performance, manage resources and make sustainability initiatives more measurable. Technology gives sustainability intelligence. Sustainability gives technology purpose.",
      },
    ],
    blocks: [
      {
        type: "grid",
        eyebrow: "One digital thread",
        title: "Digital runs through the whole ecosystem.",
        intro:
          "Not another independent business — a thread connecting every Vaibhav Veda vertical.",
        items: [
          {
            title: "Green × Digital",
            text: "Monitoring. Data. Green technologies. Smarter resource decisions.",
          },
          {
            title: "Build × Digital",
            text: "Smart infrastructure. Project visibility. Technology-enabled asset management.",
          },
          {
            title: "Learn × Digital",
            text: "E-learning. Digital certifications. Wider access to skills.",
          },
          {
            title: "Advise × Digital",
            text: "Data-led insights. Digital processes. Better strategic visibility.",
          },
        ],
      },
      {
        type: "lines",
        eyebrow: "People at the centre",
        title: "Digital transformation is ultimately experienced by a person.",
        lines: [
          "The student opening a course on a phone.",
          "The project manager checking progress from another city.",
          "The organisation understanding its performance more clearly.",
          "The institution reaching people it never could before.",
          "The entrepreneur taking an idea to a larger market.",
        ],
        outro:
          "These are the moments that make technology meaningful. We want digital progress to feel human.",
      },
      {
        type: "statement",
        eyebrow: "Larger reach",
        title: "From local possibility to larger reach.",
        paragraphs: [
          "A physical programme may reach hundreds. A digital platform can reach thousands. A successful process can become repeatable.",
          "A useful idea can travel across cities, states and eventually borders.",
        ],
        kicker:
          "Technology creates scale. Thoughtful technology creates meaningful scale.",
      },
      {
        type: "grid",
        eyebrow: "Five verticals. One connected vision.",
        title: "Why five verticals belong under one identity.",
        items: [
          { title: "Green", text: "Protecting tomorrow." },
          { title: "Build", text: "Creating tomorrow." },
          { title: "Learn", text: "Preparing people for tomorrow." },
          { title: "Advise", text: "Guiding decisions for tomorrow." },
          { title: "Digital", text: "Connecting tomorrow." },
        ],
      },
    ],
    closing: {
      title: "The future will be connected.",
      text: "Connected people. Connected institutions. Connected knowledge. Connected infrastructure. Connected opportunities. We see technology as the bridge that brings these possibilities closer together. Let's build what comes next — together.",
      ctas: ["Explore Digital Opportunities", "Collaborate With Us"],
    },
  },
];

export const getVertical = (slug: VerticalSlug) =>
  verticalPages.find((v) => v.slug === slug)!;
