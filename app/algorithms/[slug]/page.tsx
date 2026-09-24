import { ALGORITHM_DATA } from '../../../lib/algorithms';
import AlgorithmLayout from '../../../components/AlgorithmLayout';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
    return Object.keys(ALGORITHM_DATA).map((slug) => ({
        slug,
    }));
}

export default function AlgorithmPage({ params }: { params: { slug: string } }) {
    const content = ALGORITHM_DATA[params.slug];

    if (!content) {
        notFound();
    }

    return <AlgorithmLayout content={content} />;
}
