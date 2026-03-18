import frCommon from "./fr/common";
import frHeader from "./fr/header";
import frTag from "./fr/tag";
import frUpload from "./fr/upload";
import frTlEdition from "./fr/tierlistEdition";
import frGallery from "./fr/gallery";
import frCreate from "./fr/createPage";
import frHome from "./fr/tlHomePage";

import enCommon from "./en/common";
import enHeader from "./en/header";
import enTag from "./en/tag";
import enUpload from "./en/upload";
import enTlEdition from "./en/tierlistEdition"; 
import enGallery from "./en/gallery";
import enCreate from "./en/createPage";
import enHome from "./en/tlHomePage";

export const translations = {
  fr: {
    common: frCommon,
    header: frHeader,
    tag: frTag, 
    upload: frUpload, 
    tlEdition: frTlEdition,
    gallery: frGallery, 
    createPage: frCreate,
    homePage: frHome
  },
  en: {
    common: enCommon,
    header: enHeader,
    tag: enTag, 
    upload: enUpload, 
    tlEdition: enTlEdition, 
    gallery: enGallery, 
    createPage: enCreate, 
    homePage: enHome
  }
};