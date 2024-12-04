import logger from '@/services/logger';
import {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const revalidatePath: string = req.query.pathToRevalidate as string;
    console.log(
      `Recieved Api Request Process started to revalidate, ${revalidatePath}`
    );
    await res.revalidate(revalidatePath);
    logger.info(
      `Recieved Api Request Process started to revalidate, ${revalidatePath}`
    );
    return res.json({revalidated: true});
  } catch (err) {
    logger.error(`Error revalidating: ${JSON.stringify(err)}`);
    return res.status(500).send('Error revalidating');
  }
}
