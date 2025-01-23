import schools1 from '../data/schools-1.json' assert { type: "json" };
import schools2 from '../data/schools-2.json' assert { type: "json" };

// Define the function with proper types for Request and Response
export const getSchools = (req: { query: { cityId: string } }, res: { json: (data: any) => void, status: (code: number) => { json: (data: any) => void } }): void => {
  const cityId = req.query.cityId;

  if (!cityId) {
    return res.status(400).json({ error: 'cityId is required' });
  }

  let schools:any[] = [];
  if (cityId === '1') schools = schools1;
  else if (cityId === '2') schools = schools2;
  else schools = [];

  return res.json(schools);
};
