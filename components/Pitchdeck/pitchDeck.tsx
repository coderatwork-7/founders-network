import Image from 'next/image';
import styles from './pitchDeck.module.scss';

interface PitchDeckProps {
  url: string;
}

const PitchDeck: React.FC<PitchDeckProps> = ({url}) => {
  const handleOpenPitchDeck = () => {
    window.open(url, '_blank');
  };
  return (
    <div className={styles.pitchDeck} onClick={handleOpenPitchDeck}>
      <button className={styles.button} />
      {url.toLowerCase().endsWith('.pdf') ? (
        <embed
          src={url}
          width="130"
          height="130"
          onClick={handleOpenPitchDeck}
        />
      ) : (
        <Image src={url} alt="Pitch Deck" width={100} height={100} />
      )}
    </div>
  );
};

export default PitchDeck;
