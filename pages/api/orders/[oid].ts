import { NextApiRequest, NextApiResponse } from 'next';
import { bigcommerceClient, getSession } from '@lib/auth';

export default async function orders(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { oid },
        method,
    } = req;

    switch (method) {
        case 'GET':
            try {
                const { accessToken, storeHash } = await getSession(req);
                const bigcommerce = bigcommerceClient(accessToken, storeHash, 'v2');

                const data = await bigcommerce.get(`/orders/${oid}`);
                res.status(200).json(data);
            } catch (error) {
                const { message, response } = error;
                res.status(response?.status || 500).json({ message });
            }
            break;
        default:
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
