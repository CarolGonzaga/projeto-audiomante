"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingOverlay from '@/components/LoadingOverlay';

function CallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            login(token);
            router.push('/bookshelf');
        } else {
            router.push('/login?error=auth_failed');
        }
    }, [searchParams, router, login]);

    return <LoadingOverlay isVisible={true} />;
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<LoadingOverlay isVisible={true} />}>
            <CallbackContent />
        </Suspense>
    );
}