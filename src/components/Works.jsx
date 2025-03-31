import React, { useEffect, useRef, useState } from "react";
import { Tilt } from 'react-tilt'
import { motion } from "framer-motion";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaGithub } from "react-icons/fa";

import { styles } from "../styles";
import { live } from "../assets";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { Link } from "react-router-dom";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  video,
  source_code_link,
}) => {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.addEventListener('error', () => {
        console.error('Video loading error');
        setVideoError(true);
      });
      
      // Set up play/pause event listeners
      videoRef.current.addEventListener('play', () => setIsPlaying(true));
      videoRef.current.addEventListener('pause', () => setIsPlaying(false));
      
      // Set initial muted state
      videoRef.current.muted = isMuted;
    }
  }, [video, isMuted]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const openSourceCode = (e) => {
    e.stopPropagation();
    window.open(source_code_link, "_blank");
  };

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
    >
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full cursor-pointer"
      >
        <div className="relative w-full h-[230px]">
          {video && !videoError ? (
            <>
              <video
                ref={videoRef}
                src={video}
                poster={image}
                loop
                playsInline
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute bottom-3 left-3 flex gap-2">
                <button 
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-black/60 hover:bg-primary flex items-center justify-center text-white transition-colors border border-white/20"
                >
                  {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
                </button>
                <button 
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-black/60 hover:bg-primary flex items-center justify-center text-white transition-colors border border-white/20"
                >
                  {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
                </button>
              </div>
            </>
          ) : (
            <img
              src={image}
              alt="project_image"
              className="w-full h-full object-cover rounded-2xl"
            />
          )}
        </div>

        <div className="mt-5">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-bold text-[24px]">{name}</h3>
            <button
              onClick={openSourceCode}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            >
              <FaGithub className="w-1/2 h-1/2 text-white" />
            </button>
          </div>
          <p className="mt-2 text-secondary text-[14px]">{description}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} `}>My work</p>
        <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
      </motion.div>

      <div className="w-full flex  ">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          Following projects showcases my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </motion.p>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-5">
        {projects.map((project, index) => (
          <ProjectCard 
            key={`project-${index}`} 
            index={index} 
            {...project} 
          />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
