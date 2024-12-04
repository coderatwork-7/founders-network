import {Button, ButtonVariants} from '@/ds/Button';
import classes from './philosophy.module.scss';
import {UpgradeCard} from '../UpgradeCard';
import {selectUserInfo} from '@/store/selectors';
import {useSelector} from 'react-redux';

interface PhilosophyObject {
  header: string;
  title: string;
  subTitle: string;
  content: Record<string, string>;
}
interface PhilosophyPropsType {
  philosophyContent: PhilosophyObject;
  handleModalOpen: () => void;
}

export const Philosophy = ({
  philosophyContent,
  handleModalOpen
}: PhilosophyPropsType) => {
  const userInfo = useSelector(selectUserInfo());
  return (
    <>
      <UpgradeCard defaultBorder className={classes['philosophyContainer']}>
        <h2 className={classes['philosophyMainHeader']}>
          {philosophyContent?.header}
        </h2>
        <h3 className={classes['philosophySecondaryHeader']}>
          {philosophyContent?.title}
        </h3>
        <h4 className={classes['philosophyTertiaryHeader']}>
          {philosophyContent?.subTitle}
        </h4>
        <div>
          {philosophyContent?.content
            ? Object.keys(philosophyContent?.content).map((item, index) => (
                <p key={index} className={classes['philosophyParagraph']}>
                  {philosophyContent?.content?.[item]}
                </p>
              ))
            : null}
        </div>
      </UpgradeCard>
      {userInfo?.paymentPlan !== 'lifetime' && (
        <div className={classes['upgradenowButtonContainer']}>
          <Button
            className={classes['upgradenowButton']}
            variant={ButtonVariants.BluePrimary}
            textUppercase
            onClick={handleModalOpen}
          >
            Upgrade Now
          </Button>
        </div>
      )}
    </>
  );
};
