import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa6";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const ExperienceCard = ({ experience }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className='flex justify-center items-center w-full h-full bg-white rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/20'>
          <img
            src="https://labs.hacktify.in/logo.png"
            alt={experience.company_name}
            className='w-[90%] h-[90%] object-contain'
            loading="lazy"
            decoding="async"
          />
        </div>
      }
    >
      <div>
        <div className='mt-5'>
          <h3 className='text-white text-[24px] font-bold'>{experience.title}</h3>
          <p className='text-secondary text-[16px] font-semibold' style={{ marginTop: 10 }}>{experience.company_name}</p>
        </div>

        <ul className='mt-5 list-disc ml-5 space-y-2'>
          {experience.points.map((point, index) => (
            <li
              key={`experience-point-${index}`}
              className='text-white-100 text-[14px] pl-1 tracking-wider'
            >
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className='flex items-center justify-center p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/20'>
        <img 
          src="https://labs.hacktify.in/logo.png" 
          alt="Hacktify Logo" 
          className="w-16 h-16 object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          What I have done so far
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          Work Experience.
        </h2>
      </motion.div>

      <div className='mt-20 flex flex-col'>
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>

        <div className="mt-8 flex justify-center">
          <a
            href="/Haryan_Madhur_CV_032025 (1).pdf"
            download="Haryan_Madhur_CV_032025 (1).pdf"
            className="inline-flex items-center gap-2 bg-[#915EFF] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#7a4cd9] transition-all duration-300"
          >
            <FaDownload />
            Download Resume
          </a>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
