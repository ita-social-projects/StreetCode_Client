const dateFormatter: Intl.DateTimeFormat = 
    new Intl.DateTimeFormat('uk-UA', { day:'numeric', month: 'long', year: 'numeric' });

export const formatDate = (date: Date | undefined): string => {
    return dateFormatter.formatToParts(date)
        .slice(0, -1)
        .map(p=> p.value)
        .join('') + ' року';
}

export const formatDates = (firstDate: Date | undefined, secondDate: Date | undefined): string => {
    let dates: string = '';
    
    if (firstDate) {
        dates += formatDate(new Date(firstDate));
    }

    if (secondDate) {
        dates += ' — ' + formatDate(new Date(secondDate));
    }

    return dates;
}