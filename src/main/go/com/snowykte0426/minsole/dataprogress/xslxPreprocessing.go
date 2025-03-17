package main

import (
	"fmt"
	"github.com/xuri/excelize/v2"
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
	newFile := excelize.NewFile()
	newSheet := "FilteredData"
	_, _ = newFile.NewSheet(newSheet)
	for colIdx, colName := range rows[0] {
		cell := fmt.Sprintf("%s1", string(rune('A'+colIdx)))
		_ = newFile.SetCellValue(newSheet, cell, colName)
	}
	rowNum := 2
	for _, row := range rows[1:] {
		if len(row) > statusIndex && row[statusIndex] == "영업" {
			for colIdx, value := range row {
				cell := fmt.Sprintf("%s%d", string(rune('A'+colIdx)), rowNum)
				_ = newFile.SetCellValue(newSheet, cell, value)
			}
			rowNum++
		}
	}
	outputFilePath := "result/filtered_data.xlsx"
	err = newFile.SaveAs(outputFilePath)
	if err != nil {
		fmt.Println("Error saving XLSX file:", err)
		return
	}
	fmt.Println("Filtered data saved to:", outputFilePath)
}
