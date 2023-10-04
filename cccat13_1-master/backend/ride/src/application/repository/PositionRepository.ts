export default interface PositionRepository {
    save(position: any): Promise<void>;
}