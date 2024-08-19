'use server';

const API_BASE_URL = process.env.NEXT_PUBLIC_MAPTILER_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

const getLocation = async (text: string) => {
  const res = await fetch(`${API_BASE_URL}/geocoding/${text}.json?key=${API_KEY}&language=en&types=country,region,subregion,county,joint_municipality,joint_submunicipality,municipality,municipal_district,locality,neighbourhood,place&limit=5`, {
    method: "GET",
  });
  return res;
};

export { getLocation };

