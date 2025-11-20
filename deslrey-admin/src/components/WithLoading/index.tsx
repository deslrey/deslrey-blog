import { Suspense } from 'react';

import Loading from '../Loading';

interface Props {
    children: any;
}

const WithLoading = ({ children }: Props) => {
    return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export default WithLoading;
