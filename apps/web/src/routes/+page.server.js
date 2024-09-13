/* eslint-disable @typescript-eslint/ban-ts-comment */
import { redirect } from "@sveltejs/kit";

// @ts-ignore
export const load = ({ params }) => {
    const { lang } = params;
    if (!lang) {
      throw redirect(302, `/vi`);
    }
  };