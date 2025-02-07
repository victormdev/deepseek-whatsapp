module.exports = {
    parseTime: (time) => {
        const unit = time.slice(-1);
        const value = parseInt(time.slice(0, -1));

        if (isNaN(value)) return null;

        switch (unit) {
            case 's': return value * 1000;
            case 'm': return value * 60 * 1000;
            case 'h': return value * 60 * 60 * 1000;
            default: return null;
        }
    }
};