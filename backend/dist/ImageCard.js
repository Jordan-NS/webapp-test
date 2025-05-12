"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const router_1 = require("next/router");
const axios_1 = require("axios");
const api_1 = require("../services/api");
const ImageCard = () => {
    const router = (0, router_1.useRouter)();
    const [status, setStatus] = (0, react_1.useState)('authenticated');
    const [localIsFavorite, setLocalIsFavorite] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [id, setId] = (0, react_1.useState)('');
    const [title, setTitle] = (0, react_1.useState)('');
    const [date, setDate] = (0, react_1.useState)('');
    const [url, setUrl] = (0, react_1.useState)('');
    const [explanation, setExplanation] = (0, react_1.useState)('');
    const handleFavorite = async () => {
        var _a, _b, _c;
        if (status !== 'authenticated') {
            router.push('/login');
            return;
        }
        try {
            setIsLoading(true);
            const newFavoriteState = !localIsFavorite;
            if (localIsFavorite) {
                console.log('Removendo favorito:', id);
                await api_1.default.delete(`/favorites/${id}`);
            }
            else {
                const favoriteData = {
                    apodId: id,
                    title,
                    date,
                    url,
                    explanation
                };
                console.log('Enviando dados do favorito:', JSON.stringify(favoriteData, null, 2));
                const response = await api_1.default.post('/favorites', favoriteData);
                console.log('Resposta do servidor:', response.data);
            }
            setLocalIsFavorite(newFavoriteState);
            onFavoriteToggle();
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                console.error('Erro ao atualizar favorito:', error);
                console.error('Detalhes do erro:', {
                    message: error.message,
                    response: (_a = error.response) === null || _a === void 0 ? void 0 : _a.data,
                    status: (_b = error.response) === null || _b === void 0 ? void 0 : _b.status,
                    headers: (_c = error.response) === null || _c === void 0 ? void 0 : _c.headers
                });
            }
            else {
                console.error('Erro desconhecido:', error);
            }
            setLocalIsFavorite(localIsFavorite);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div>
      
    </div>);
};
exports.default = ImageCard;
//# sourceMappingURL=ImageCard.js.map