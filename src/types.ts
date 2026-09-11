export type TeamSize = "2 Members" | "3 Members" | "4 Members" | "5 Members";

export type Track = "AI/ML" | "Web3" | "Smart Cities" | "HealthTech" | "Open Innovation";

export type MemberRole =
  | "Frontend"
  | "Backend"
  | "UI/UX"
  | "AI/ML"
  | "Mobile Dev"
  | "Hardware/IoT";

export interface LeaderDetails {
  name: string;
  email: string;
  phone: string;
  college: string;
  yearBranch: string;
  github: string;
}

export interface MemberDetails {
  name: string;
  email: string;
  phone: string;
  college: string;
  roles: MemberRole[];
  github?: string;
}

export interface RegistrationFormData {
  teamName: string;
  teamSize: TeamSize;
  track: Track;
  leader: LeaderDetails;
  members: MemberDetails[]; // Length must equal teamSizeNum - 1
  agreementAccepted: boolean;
  transactionId: string;
  screenshotBase64?: string;
  screenshotFileName?: string;
  screenshotFileSize?: number;
  screenshotUrl?: string;
}

export interface GoogleFormMappingDef {
  teamName: string;
  teamSize: string;
  track: string;
  leader: {
    name: string;
    email: string;
    phone: string;
    college: string;
    yearBranch: string;
    github: string;
  };
  members: Array<{
    name: string;
    email: string;
    phone: string;
    college: string;
    roles: string;
    github?: string;
  }>;
  agreement: string;
  transactionId: string;
  paymentScreenshot: string;
}

export const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeRFa5VajjvUkuadDfiJU5R9tz94V86hwKSLfiGmNmJ2ehg9g/formResponse";

export const GOOGLE_FORM_VIEW_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeRFa5VajjvUkuadDfiJU5R9tz94V86hwKSLfiGmNmJ2ehg9g/viewform";

export const AGREEMENT_TEXT =
  "I agree to adhere to the event rules, hackathon code of conduct, and terms of participation";

export const GOOGLE_FORM_MAPPING: GoogleFormMappingDef = {
  teamName: "entry.2117236276",
  teamSize: "entry.1477679129",
  track: "entry.1515561563",
  leader: {
    name: "entry.503010795",
    email: "entry.1621889209",
    phone: "entry.895352131",
    college: "entry.415838441",
    yearBranch: "entry.378728112",
    github: "entry.1213909106",
  },
  members: [
    // Member 2 (1st teammate)
    {
      name: "entry.923772706",
      email: "entry.1580529153",
      phone: "entry.2096590016",
      college: "entry.377841343",
      roles: "entry.779626043",
      github: "entry.300716458",
    },
    // Member 3 (2nd teammate)
    {
      name: "entry.2111927725",
      email: "entry.544991285",
      phone: "entry.1109240396",
      college: "entry.86084976",
      roles: "entry.1073037229",
    },
    // Member 4 (3rd teammate)
    {
      name: "entry.392308128",
      email: "entry.1998078112",
      phone: "entry.714102987",
      college: "entry.193683130",
      roles: "entry.1867574719",
    },
    // Member 5 (4th teammate)
    {
      name: "entry.759427974",
      email: "entry.478923217",
      phone: "entry.798553852",
      college: "entry.1326242421",
      roles: "entry.876894209",
    },
  ],
  agreement: "entry.1123445393",
  transactionId: "entry.894717276",
  paymentScreenshot: "entry.1062878204",
};

export const TRACK_OPTIONS: Track[] = [
  "AI/ML",
  "Web3",
  "Smart Cities",
  "HealthTech",
  "Open Innovation",
];

export const TEAM_SIZE_OPTIONS: TeamSize[] = [
  "2 Members",
  "3 Members",
  "4 Members",
  "5 Members",
];

export const ROLE_OPTIONS: MemberRole[] = [
  "Frontend",
  "Backend",
  "UI/UX",
  "AI/ML",
  "Mobile Dev",
  "Hardware/IoT",
];

export const OFFICIAL_WHATSAPP_GROUP_LINK =
  "https://chat.whatsapp.com/Cmh1MBBS112AY0sOplyBrh?s=cl&p=a&mlu=4&ilr=4";

export interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  step?: 1 | 2 | 3 | 4;
  quickActions?: {
    label: string;
    value: string;
    actionType: "setTrack" | "setSize" | "nextStep" | "setRole" | "fillSample";
  }[];
  customCard?: "teamBasics" | "leaderForm" | "memberForm" | "confirmationCard" | "errorCard";
}
