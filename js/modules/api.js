const API_BASE_URL = '/api';

export async function submitBooking(bookingData) {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка сервера');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при отправке заявки:', error);
        throw error;
    }
}

export async function submitCharacterRequest(requestData) {
    try {
        const response = await fetch(`${API_BASE_URL}/character-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error('Ошибка сервера');
        }

        return await response.json();
    } catch (error) {
        console.warn('Не удалось отправить пожелание на сервер:', error);
        throw error;
    }
}