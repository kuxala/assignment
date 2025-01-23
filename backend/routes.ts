import { Router, Request, Response } from 'express';
import cities from './data/cities.json';
import formStructure from './data/form.json';
import { getSchools } from './controllers/schoolController';
import { submitForm } from './controllers/submitController';
// import formStructure from './data/form-test.json';
const router = Router();


router.get('/cities', (req: Request, res: Response) => {
  res.json(cities);
});
router.get('/schools', getSchools);
router.get('/form', (req: Request, res: Response) => {
  res.json(formStructure);
});
router.post('/submit', submitForm);



export default router;
