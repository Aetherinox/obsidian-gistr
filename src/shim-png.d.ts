/*
    Allow use of PNGs
*/

declare module "*.png"
{
    const data: string;
    export default data;
}