import { Request, Response } from 'express';
import * as showService from '../services/showService';

export const createShow = async (req: Request, res: Response) => {
  const { name, start_time, total_seats } = req.body;
  try {
    const show = await showService.createNewShow(name, start_time, total_seats);
    res.status(201).json(show);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getShows = async (req: Request, res: Response) => {
  try {
    const shows = await showService.getAllShows();
    res.json(shows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getShowById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const show = await showService.getShowDetails(Number(id));
    if (!show) {
       res.status(404).json({ error: 'Show not found' });
       return;
    }
    res.json(show);
  } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Internal Server Error' });
  }
};
