import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { FaQuoteLeft } from "react-icons/fa";
import ashutoshImg from "../assets/ashutosh.jpg.jpg";
// Import image directly from public folder for Pritesh
const priteshImg = "/images/pritesh_custom.jpg";

const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className='bg-black-200 p-10 rounded-3xl xs:w-[320px] w-full'
  >
    <FaQuoteLeft className='text-[#915EFF] w-8 h-8 mb-2' />

    <div className='mt-1'>
      <p className='text-white tracking-wider text-[18px]'>{testimonial}</p>

      <div className='mt-7 flex justify-between items-center gap-1'>
        <div className='flex-1 flex flex-col'>
          <p className='text-white font-medium text-[16px] whitespace-nowrap'>
            <span className='blue-text-gradient'>@</span> {name}
          </p>
          <p className='mt-1 text-secondary text-[12px] whitespace-nowrap'>
            {designation} {company}
          </p>
        </div>

        <img
          src={image}
          alt={`feedback_by-${name}`}
          className='w-16 h-16 rounded-full object-cover'
        />
      </div>
    </div>
  </motion.div>
);

const Feedbacks = () => {
  const testimonials = [
    {
      testimonial:
        "Madhur is an exceptional developer with a strong foundation in IoT and AI. His ability to solve complex problems and deliver innovative solutions is truly impressive.",
      name: "Pritesh Haryan",
      designation: "Works at",
      company: "Samsung",
      image: priteshImg,
    },
    {
      testimonial:
        "Madhur's knowledge in IoT and AI is outstanding. He consistently delivers high-quality solutions and is always willing to share his expertise with the team.",
      name: "Ashutosh Singh",
      designation: "Fellow",
      company: "Batchmate",
      image: ashutoshImg,
    },
  ];

  return (
    <div className={`mt-12 bg-black-100 rounded-[20px]`}>
      <div
        className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[300px]`}
      >
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>What others say</p>
          <h2 className={styles.sectionHeadText}>Testimonials.</h2>
        </motion.div>
      </div>
      <div className={`-mt-20 pb-14 ${styles.paddingX} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center`}>
        {testimonials.map((testimonial, index) => (
          <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Feedbacks, "");
