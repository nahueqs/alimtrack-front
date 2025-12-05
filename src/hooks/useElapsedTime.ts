import {useEffect, useState} from 'react';

const formatDuration = (seconds: number): string => {
    if (seconds < 0) seconds = 0;

    const days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    const secs = Math.floor(seconds);

    let durationString = '';
    if (days > 0) durationString += `${days}d `;
    durationString += `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    return durationString;
};

export const useElapsedTime = (startTime: string | null, endTime: string | null = null) => {
    const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');

    useEffect(() => {
        if (!startTime) {
            setElapsedTime('N/A');
            return;
        }

        const start = new Date(startTime).getTime();

        // Si la producción ha finalizado, calcula la duración total y detiene el hook.
        if (endTime) {
            const end = new Date(endTime).getTime();
            const durationInSeconds = (end - start) / 1000;
            setElapsedTime(formatDuration(durationInSeconds));
            return;
        }

        // Si la producción está en curso, actualiza el tiempo cada segundo.
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const durationInSeconds = (now - start) / 1000;
            setElapsedTime(formatDuration(durationInSeconds));
        }, 1000);

        // Limpia el intervalo cuando el componente se desmonta.
        return () => clearInterval(interval);
    }, [startTime, endTime]);

    return elapsedTime;
};
