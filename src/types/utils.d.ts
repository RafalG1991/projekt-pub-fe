// Deklaracje modułów dla assetów/CSS (jeśli importujesz obrazki/CSS w kodzie)
declare module "*.png" { const src: string; export default src; }
declare module "*.jpg" { const src: string; export default src; }
declare module "*.jpeg" { const src: string; export default src; }
declare module "*.svg" { const src: string; export default src; }
declare module "*.css";
