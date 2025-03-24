package main

import (
	"fmt"
	"log"

	"github.com/xuri/excelize/v2"
)

func main() {
	f, err := excelize.OpenFile("result/output.xlsx")
	if err != nil {
		log.Fatalf("파일 열기 실패: %v", err)
	}
	sheetName := f.GetSheetName(0)
	rows, err := f.GetRows(sheetName)
	if err != nil {
		log.Fatalf("행 읽기 실패: %v", err)
	}
	if len(rows) == 0 {
		log.Fatal("데이터가 없습니다.")
	}
	header := rows[0]
	designatedIndex := -1
	removeColNames := map[string]bool{
		"지정취소일자":   true,
		"저정취소사유":   true,
		"폐업일자":     true,
		"불가일자":     true,
		"불가사유":     true,
		"재지정일자":    true,
		"데이터갱신구분":  true,
		"데이터갱신일자":  true,
		"영업상태명":    true,
		"영업상태구분코드": true,
	}
	removeCols := make(map[int]bool)
	for i, colName := range header {
		if removeColNames[colName] {
			removeCols[i] = true
		}
		if colName == "지정취소일자" {
			designatedIndex = i
		}
	}
	if designatedIndex == -1 {
		log.Println("경고: '지정취소일자' 칼럼을 찾을 수 없습니다.")
	}
	var newRows [][]string
	var newHeader []string
	for i, col := range header {
		if !removeCols[i] {
			newHeader = append(newHeader, col)
		}
	}
	newRows = append(newRows, newHeader)
	for _, row := range rows[1:] {
		if designatedIndex < len(row) && row[designatedIndex] != "" {
			continue
		}
		var newRow []string
		for i, cell := range row {
			if !removeCols[i] {
				newRow = append(newRow, cell)
			}
		}
		newRows = append(newRows, newRow)
	}
	newFile := excelize.NewFile()
	newSheet := newFile.GetSheetName(newFile.GetActiveSheetIndex())
	for r, row := range newRows {
		for c, cell := range row {
			cellName, err := excelize.CoordinatesToCellName(c+1, r+1)
			if err != nil {
				log.Fatalf("셀명 변환 오류: %v", err)
			}
			_ = newFile.SetCellValue(newSheet, cellName, cell)
		}
	}
	if err := newFile.SaveAs("result/outpt.xlsx"); err != nil {
		log.Fatalf("파일 저장 실패: %v", err)
	}
	fmt.Println("처리 완료: output.xlsx 파일이 생성되었습니다.")
}
