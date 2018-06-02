
export default {

    /**
     * Rounds the number unit value to 2 digits
     * @public
     * @param {string} sValue the number string to be rounded
     * @returns {string} sValue with 2 digits rounded
     */
    numberUnit(sValue: string): string {
        if (!sValue) {
            return "";
        }
        return parseFloat(sValue).toFixed(2);
    },

    /**
     * Rounds the currency value to 2 digits
     *
     * @public
     * @param {string} sValue value to be formatted
     * @returns {string} formatted currency value with 2 digits
     */
    currencyValue: function (sValue?: string): string {
        if (!sValue) {
            return "";
        }

        return parseFloat(sValue).toFixed(2);
    }
}