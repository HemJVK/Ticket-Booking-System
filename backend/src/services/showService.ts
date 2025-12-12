import * as showRepo from '../repositories/showRepository';

export const createNewShow = async (name: string, start_time: string, total_seats: number) => {
    return await showRepo.insertShow(name, start_time, total_seats);
};

export const getAllShows = async () => {
    return await showRepo.fetchAllShows();
};

export const getShowDetails = async (id: number) => {
    return await showRepo.fetchShowById(id);
};
