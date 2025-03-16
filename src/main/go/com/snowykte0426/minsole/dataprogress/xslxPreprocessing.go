package main

import (
	"fmt"
	"github.com/xuri/excelize/v2"
	"golang.org/x/text/encoding/korean"
	"golang.org/x/text/transform"
	"os"
	"strings"
)

func main() {
	filePath := "data/model_restaurant_sheet.xlsx"
	f, err := excelize.OpenFile(filePath)
	if err != nil {
		fmt.Println("Error opening XLSX file:", err)
		return
	}
	defer func(f *excelize.File) {
		err := f.Close()
		if err != nil {
			fmt.Println("Error closing XLSX file:", err)
		}
	}(f)
	sheetName := f.GetSheetName(0)
	if sheetName == "" {
		fmt.Println("Error: No sheets found in the Excel file.")
		return
	}
	rows, err := f.GetRows(sheetName)
	if err != nil {
		fmt.Println("Error reading rows:", err)
		return
	}

	if len(rows) == 0 {
		fmt.Println("Error: Empty sheet.")
		return
	}
	statusIndex := -1
	for i, col := range rows[0] {
		if col == "영업상태명" {
			statusIndex = i
			break
		}
	}

	if statusIndex == -1 {
		fmt.Println("Error: '영업상태명' column not found")
		return
	}
	var filteredRows [][]string
	filteredRows = append(filteredRows, rows[0])

	for _, row := range rows[1:] {
		if len(row) > statusIndex && row[statusIndex] == "영업" {
			filteredRows = append(filteredRows, row)
		}
	}
	outputFile, err := os.Create("result/filtered_data.csv")
	if err != nil {
		fmt.Println("Error creating CSV file:", err)
		return
	}
	defer func(outputFile *os.File) {
		err := outputFile.Close()
		if err != nil {
			fmt.Println("Error closing CSV file:", err)
		}
	}(outputFile)

	writer := transform.NewWriter(outputFile, korean.EUCKR.NewEncoder())

	for _, row := range filteredRows {
		line := strings.Join(row, ",") + "\n"
		_, err := writer.Write([]byte(line))
		if err != nil {
			fmt.Println("Error writing to CSV:", err)
			return
		}
	}

	fmt.Println("Filtered data saved to filtered_data.csv")
}
