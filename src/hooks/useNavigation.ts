import { useRouter as useNextRouter } from 'next/navigation';

export const useNavigation = () => {
    let togo = (path:string) => {
        if(typeof window != undefined) {
            window.location.href = path;
        }
    };

    try {
        const router = useNextRouter();
        togo = (path) => {
            router.push(path);
        }
    } catch {}

    return { goHome: () => togo("/"), togo };
}