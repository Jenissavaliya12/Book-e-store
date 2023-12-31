import React, { useEffect, useState } from "react";
import { defaultFilter, RecordsPerPage } from "../../constant/constant";
import { productStyle } from "./style";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import Shared from "../../utils/shared";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import TablePagination from "@material-ui/core/TablePagination";

import userService from "../../service/user.service";

import { useAuthContext } from "./../../context/auth";
import ConfirmationDialog from "./../../components/ConfirmationDialog";

const User = () => {
  const classes = productStyle();
  const authContext = useAuthContext();
  const [filters, setFilters] = useState(defaultFilter);
  const [userRecords, setUserRecords] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      getAllUsers({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const getAllUsers = async (filters) => {
    await userService.getAllUser(filters).then((res) => {
      if (res) {
        setUserRecords(res);
      }
    });
  };
  const onConfirmDelete = () => {
    userService
      .deleteUser(selectedId)
      .then((res) => {
        toast.success(Shared.messages.DELETE_SUCCESS);
        setOpen(false);
        setFilters({ ...filters });
      })
      .catch((e) => toast.error(Shared.messages.DELETE_FAIL));
  };

  const columns = [
    { id: "firstName", label: "First Name", minWidth: 100 },
    { id: "lastName", label: "Last Name", minWidth: 100 },
    { id: "email", label: "Email", minWidth: 100 },
    { id: "roleName", label: "Role", minWidth: 100 },
  ];

  console.log("userRecords" + userRecords);
  return (
    <div className={classes.productWrapper}>
      <div className="container">
        <h5 className="Book-page text-center mb-5 mt-5">Book Page</h5>
        <div className="search-head-container">
          <div className="search-book-container">
            <input
              type="text"
              id="text"
              placeholder="Search..."
              className="search-add-field"
              onChange={(e) => {
                setFilters({
                  ...filters,
                  keyword: e.target.value,
                  pageIndex: 1,
                });
              }}
              name="text"
            />
          </div>
        </div>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userRecords?.items?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.firstName}</TableCell>
                  <TableCell>{row.lastName}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell align="right">
                    <button
                      className=" edit-btn"
                      type="button"
                      onClick={() => {
                        navigate(`/edit-user/${row.id}`);
                      }}
                    >
                      Edit
                    </button>
                    {row.id !== authContext.user.id && (
                      <button
                        className="delete-btn "
                        type="button"
                        onClick={() => {
                          setOpen(true);
                          setSelectedId(row.id ?? 0);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!userRecords?.items?.length && (
                <TableRow className="TableRow">
                  <TableCell colSpan={5} className="TableCell">
                    <p> No Users</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={RecordsPerPage}
          component="div"
          count={userRecords.totalItems}
          rowsPerPage={filters.pageSize || 0}
          page={filters.pageIndex - 1}
          onPageChange={(e, newPage) => {
            setFilters({ ...filters, pageIndex: newPage + 1 });
          }}
          onRowsPerPageChange={(e) => {
            setFilters({
              ...filters,
              pageIndex: 1,
              pageSize: Number(e.target.value),
            });
          }}
        />
        <ConfirmationDialog
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => onConfirmDelete()}
          title="Delete book"
          description="Are you sure you want to delete this user?"
        />
      </div>
    </div>
  );
};

export default User;
