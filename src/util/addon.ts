export default abstract class Addon {
    running = false;

    abstract init(): any;
    abstract stop(): any;
}
