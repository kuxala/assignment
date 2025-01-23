import { Router, Request, Response } from 'express';
import cities from '../data/cities.json' assert { type: "json" };
import { getSchools } from '../controllers/schoolController.js';
import { getFormStructure, submitForm } from '../controllers/submitController.js';
// import formStructure from './data/form-test.json';
const router = Router();


router.get('/cities', (req: Request, res: Response) => {
  res.json(cities);
});
router.get('/schools', getSchools);
router.get('/form', getFormStructure);
router.post('/submit', submitForm);



export default router;
