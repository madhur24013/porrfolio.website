import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  Three3js,
  mui,
  express,
  mysql,
  aws,
  project1,
  project2,
  project3,
  vacuumRobotVideo,
  github,
  smartRobot,
} from "../assets";
import tekisky from '../assets/company/tekisky.png';
// import project2 from '../assets/project2.png'

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "achievements",
    title: "Achievements",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Frontend Development",
    icon: web,
  },
  {
    title: "Backend Development",
    icon: backend,
  },
  {
    title: "Database Management",
    icon: mobile,
  },
  {
    title: "3D Web Graphics",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML5",
    icon: html,
  },
  {
    name: "CSS3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "MySQL",
    icon: mysql,
  },
  {
    name: "Three.js",
    icon: Three3js,
  },
  {
    name: "Git",
    icon: git,
  },
  {
    name: "GitHub",
    icon: github,
  },
];

const experiences = [
  {
    title: "Cybersecurity Intern",
    company_name: "Hacktify",
    icon: tekisky,
    iconBg: "#383E56",
    date: "Sep 2024 - Oct 2024",
    points: [
      "Conducted vulnerability assessments on live web applications",
      "Performed penetration testing & ethical hacking",
      "Assisted in security risk analysis & report preparation",
      "Worked with senior cybersecurity professionals to mitigate cyber threats",
      "Environment Used: Kali Linux",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "Madhur demonstrated exceptional skills in cybersecurity and problem-solving during his internship. His attention to detail and analytical approach were invaluable to our team.",
    name: "Security Team Lead",
    designation: "Cybersecurity",
    company: "Hacktify",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "His expertise in both hardware and software development, combined with his understanding of AI and IoT, makes him a versatile and valuable team member.",
    name: "Project Manager",
    designation: "IoT Development",
    company: "Tech Solutions",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    testimonial:
      "Madhur's ability to integrate AI with traditional development practices has significantly improved our project's efficiency and user experience.",
    name: "Senior Developer",
    designation: "AI Development",
    company: "Innovation Labs",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
  },
];

const projects = [
  {
    name: "Arduino Smart Vacuum Cleaner Robot",
    description:
      "Developed an intelligent vacuum cleaner robot using Arduino and C++. Features include obstacle detection, path planning, and efficient cleaning patterns.",
    tags: [
      {
        name: "C++",
        color: "blue-text-gradient",
      },
      {
        name: "Arduino",
        color: "green-text-gradient",
      },
      {
        name: "IoT",
        color: "orange-text-gradient",
      },
      {
        name: "Hardware",
        color: "pink-text-gradient",
      },
    ],
    image: "/images/smart_robot_custom.png",
    video: vacuumRobotVideo,
    source_code_link: "https://github.com/madhur24013/Iot.website.git",
  },
  {
    name: "IoT Website",
    description:
      "The Arduino Smart Vacuum Cleaner Robot website provides a comprehensive overview of the project, featuring detailed documentation with technical specifications and circuit diagrams. It includes a media gallery showcasing images and video demonstrations of the robot's design and functionality.",
    tags: [
      {
        name: "Django",
        color: "blue-text-gradient",
      },
      {
        name: "Python",
        color: "green-text-gradient",
      },
      {
        name: "AI/ML",
        color: "orange-text-gradient",
      },
      {
        name: "IoT",
        color: "pink-text-gradient",
      },
    ],
    image: "/images/iot_project.png",
    source_code_link: "https://github.com/madhur24013/Iot.website.git",
  },
];

export { services, technologies, experiences, testimonials, projects };
