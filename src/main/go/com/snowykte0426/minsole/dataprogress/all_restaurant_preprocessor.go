package main

import (
	"fmt"
	"github.com/xuri/excelize/v2"
)

func main() {
	filePath := "data/all_restaurant_sheet.xlsx"
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
	newFile := excelize.NewFile()
	newSheet := "FilteredData"
	_, _ = newFile.NewSheet(newSheet)
	resultRowNum := 1
	sheetList := f.GetSheetList()
	for _, sheetName := range sheetList {
		rows, err := f.GetRows(sheetName)
		if err != nil {
			fmt.Printf("Error reading rows in sheet %s: %v\n", sheetName, err)
			continue
		}
		if len(rows) == 0 {
			fmt.Printf("Warning: Sheet %s is empty.\n", sheetName)
			continue
		}
		statusIndex := -1
		for i, col := range rows[0] {
			if col == "영업상태명" {
				statusIndex = i
				break
			}
		}
		if statusIndex == -1 {
			fmt.Printf("Warning: '영업상태명' column not found in sheet %s\n", sheetName)
			continue
		}
		if resultRowNum == 1 {
			for colIdx, colName := range rows[0] {
				cell := fmt.Sprintf("%s%d", string(rune('A'+colIdx)), resultRowNum)
				_ = newFile.SetCellValue(newSheet, cell, colName)
			}
			resultRowNum++
		}
		for _, row := range rows[1:] {
			if len(row) > statusIndex && row[statusIndex] == "영업" {
				for colIdx, value := range row {
					cell := fmt.Sprintf("%s%d", string(rune('A'+colIdx)), resultRowNum)
					_ = newFile.SetCellValue(newSheet, cell, value)
				}
				resultRowNum++
			}
		}
	}
	outputFilePath := "result/all_restaurant_filtered_data.xlsx"
	err = newFile.SaveAs(outputFilePath)
	if err != nil {
		fmt.Println("Error saving XLSX file:", err)
		return
	}
	fmt.Println("Filtered data saved to:", outputFilePath)
}
