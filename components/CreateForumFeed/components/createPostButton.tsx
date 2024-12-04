import {Button, ButtonVariants} from '@/ds/Button';
import {Spinner} from '@/ds/Spinner';
import {DropdownItem} from '@/types/dropdown';
import {OnboardingTooltip} from '@/components/Onboarding/OnboardingTooltip';
import classes from '../createForumFeed.module.scss';

type CreatePostButtonProps = {
  handleOpenModal: () => void;
};

export const CreatePostButton: React.FC<CreatePostButtonProps> = ({
  handleOpenModal
}) => {
  return (
    <>
      <Button variant={ButtonVariants.Primary} onClick={handleOpenModal}>
        CREATE NEW POST
      </Button>
      <div className={classes.onboarding}>
        <OnboardingTooltip type="forum" position="left" />
      </div>
    </>
  );
};
