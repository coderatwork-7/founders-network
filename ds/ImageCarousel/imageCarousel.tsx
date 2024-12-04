import classes from './imageCarousel.module.scss';
import {Spinner} from '../Spinner';
import {Carousel, CarouselProps} from 'react-bootstrap';
import Image from 'next/image';
import clsx from 'clsx';

export type CarouselImage = {
  key: string | number;
  src: string;
  rawSrc?: string;
  loading?: boolean;
};

type ImageCarouselPros = {
  images: CarouselImage[];
} & CarouselProps;

export const ImageCarousel = ({
  images,
  className,
  ...props
}: ImageCarouselPros) => {
  const isSingleImage = images.length === 1;

  return (
    <Carousel
      interval={null}
      controls={!isSingleImage}
      keyboard={!isSingleImage}
      indicators={!isSingleImage}
      className={clsx(classes.carousel, className)}
      {...props}
    >
      {images.map(img => (
        <Carousel.Item key={img.key ?? img.src}>
          {(img.loading || !img.src) && (
            <div className={clsx(classes.overlay, classes.spinner)}>
              <Spinner size="sm" className="mx-auto" />
            </div>
          )}

          <div className={classes.carouselItem}>
            {img.src && (
              <Image
                fill
                priority={true}
                alt="Carousel Image"
                className={classes.image}
                src={img.rawSrc ?? img.src}
              />
            )}
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};
