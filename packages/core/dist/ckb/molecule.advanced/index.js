export * from "./generated.js";
export function molOptional(mol) {
    if (mol.hasValue()) {
        return mol.value();
    }
    return;
}
