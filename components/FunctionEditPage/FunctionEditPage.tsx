import React, {FormEvent, useState} from 'react';
import classes from './FunctionEditPage.module.scss';
import {FunctionDetails} from './forms/functionDetails';
import useAdminFunctionTags from './hooks/useAdminFunctionTags';
import useAPI from '@/utils/common/useAPI';
import {FunctionTickets} from './forms/functionTickets';
import {FeaturedRemiders} from './forms/featuredRemiders';
import {FeaturedProfiles} from './forms/featuredProfiles';
import {FunctionSponsors} from './forms/functionSponsors';
import {VenuePhotos} from './forms/venuePhotos';
import EditFunctionButtons, {
  EDIT_FUNCTION_BTNS
} from './components/EditFunctionButtons';
import useFormStates from './hooks/useFormStates';
import {useSelector} from 'react-redux';
import {selectUserInfo} from '@/store/selectors';
import {toast} from 'react-toastify';

export type SelectOptionType = {
  label: string;
  value: any;
};

interface FunctionEditPageProps {
  id?: string;
}

export const FunctionEditPage: React.FC<FunctionEditPageProps> = ({id}) => {
  const api = useAPI();
  const userId = useSelector(selectUserInfo())?.id;

  const {
    detailsFormData,
    setDetailsFormData,
    ticketsFormData,
    setTicketsFormData,
    remindersFormData,
    setRemindersFormData,
    profilesFormData,
    setProfilesFormData,
    functionSponsors,
    setFunctionSponsors,
    venuePhotos,
    resetKey,
    setVenuePhotos,
    getFormData,
    resetFormData
  } = useFormStates();

  const {
    chapter: chapterOptions,
    timezone: timezoneOptions,
    tags: functionTagOptions,
    functionType: functionTypeOptions,
    functionSubgroup: functionSubgroupOptions,
    featuredMember: featuredMemberOptions,
    featuredInvestor: featuredInvestorOptions,
    partnerCompany: partnerCompanyOptions,
    loading: tagsLoading
  } = useAdminFunctionTags();

  const handleFileUpload = (file: Blob) => {
    const formData = new FormData();
    formData.append('s3file', file);

    return api(
      'postFile',
      {},
      {
        method: 'POST',
        data: formData
      }
    );
  };

  const saveFunctionDraft = () => {
    api(
      'saveFunctionDraft',
      {userId},
      {
        method: 'POST',
        data: getFormData()
      }
    )
      .then(() => {
        resetFormData();
        toast.success('Function Draft Saved!', {theme: 'dark'});
      })
      .catch(() => {
        toast.error('Error Saving Draft!', {theme: 'dark'});
      });
  };

  const publishFunction = () => {
    api(
      'postNewFunction',
      {userId},
      {
        method: 'POST',
        data: getFormData()
      }
    )
      .then(() => {
        resetFormData();
        toast.success('Function Created!', {theme: 'dark'});
      })
      .catch(() => {
        toast.error('Error creating Function  !', {theme: 'dark'});
      });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    switch ((event.nativeEvent as SubmitEvent).submitter?.id) {
      case EDIT_FUNCTION_BTNS.PUBLISH:
        publishFunction();
        break;

      case EDIT_FUNCTION_BTNS.PREVIEW:
        // postPreviewData();
        break;

      case EDIT_FUNCTION_BTNS.SAVE_DRAFT:
        saveFunctionDraft();
        break;

      default:
        break;
    }
  };

  return (
    <div className={classes.page}>
      <form onSubmit={handleSubmit} key={resetKey}>
        <div className={classes.header}>
          {id ? <div>Edit Function</div> : <div>Create a Function</div>}
          <EditFunctionButtons />
        </div>
        <section className={classes.section}>
          <div className={classes.sectionHeader}>
            Function Details <span className="text-danger">*</span>
          </div>

          <FunctionDetails
            data={detailsFormData}
            setData={setDetailsFormData}
            chapterOptions={chapterOptions}
            timezoneOptions={timezoneOptions}
            tagsLoading={tagsLoading}
            functionTagOptions={functionTagOptions}
            functionTypeOptions={functionTypeOptions}
            functionSubgroupOptions={functionSubgroupOptions}
            handleFileUpload={handleFileUpload}
          />
        </section>

        <section className={classes.section}>
          <div className={classes.sectionHeader}>
            Tickets <span className="text-danger">*</span>
          </div>

          <FunctionTickets
            data={ticketsFormData}
            setData={setTicketsFormData}
            featuredMemberOptions={featuredMemberOptions}
            tagsLoading={tagsLoading}
          />
        </section>

        <section className={classes.section}>
          <div className={classes.sectionHeader}>
            Featured Reminders <span className="text-danger">*</span>
          </div>

          <FeaturedRemiders
            data={remindersFormData}
            setData={setRemindersFormData}
          />
        </section>

        <section className={classes.section}>
          <div className={classes.sectionHeader}>Featured Profiles</div>

          <FeaturedProfiles
            data={profilesFormData}
            setData={setProfilesFormData}
            featuredMemberOptions={featuredMemberOptions}
            tagsLoading={tagsLoading}
            featuredInvestorOptions={featuredInvestorOptions}
            partnerCompanyOptions={partnerCompanyOptions}
          />
        </section>

        <section className={classes.section}>
          <div className={classes.sectionHeader}>Function Sponsors</div>

          <FunctionSponsors
            data={functionSponsors}
            setData={setFunctionSponsors}
          />
        </section>

        <section className={classes.section}>
          <div className={classes.sectionHeader}>Venue Photos</div>

          <VenuePhotos
            data={venuePhotos}
            setData={setVenuePhotos}
            handleFileUpload={handleFileUpload}
          />
        </section>

        <div className={classes.footer}>
          <EditFunctionButtons />
        </div>
      </form>
    </div>
  );
};
