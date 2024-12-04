import {useEffect} from 'react';

export default function useScrollVisible(
  ids: string[],
  handleActive: (id: string | null) => void // eslint-disable-line no-unused-vars
) {
  useEffect(() => {
    const handleScroll = () => {
      const sections = ids.map(id => document.getElementById(id));
      let currentSection = null;

      sections.forEach(section => {
        const rect = section?.getBoundingClientRect();
        if (rect && rect.top <= 120 && rect.bottom >= 0) {
          currentSection = section?.id;
        }
      });

      currentSection && handleActive(currentSection);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ids, handleActive]);
}
