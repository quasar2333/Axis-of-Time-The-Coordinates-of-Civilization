import { Router } from 'express';
import events from '../../data/seeds/events.json' assert { type: 'json' };

const router = Router();

router.get('/', (req, res) => {
  const start = parseInt(req.query.start_year, 10);
  const end = parseInt(req.query.end_year, 10);
  if (!isNaN(start) && !isNaN(end)) {
    const filtered = events.filter(e => e.year >= start && e.year <= end);
    res.json(filtered);
  } else {
    res.json(events);
  }
});

export default router;
